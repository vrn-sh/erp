import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Stack } from '@mui/material';
import '../../Dashboard.scss';
import { SecondaryButton, PrimaryButton } from '../../../../component/Button';
import { IDashboardNotes } from '../../DashBoardNote.type';
import config from '../../../../config';
import Feedbacks from '../../../../component/Feedback';
import { getCookiePart } from '../../../../crypto-utils';

interface ViewNoteProps {
    note: IDashboardNotes;
    func: any;
}

export default function ViewNote({ note, func }: ViewNoteProps) {
    const [isEdit, SetisEdit] = useState(false);
    const [content, setContent] = useState(note.content);
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';

    const takeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const close = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        if (isEdit) {
            SetisEdit(!isEdit);
            return;
        }
        await axios
            .delete(`${config.apiUrl}/note/${note.id}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then(() => {
                setMessage('Successfuly deleted', 'success');
                func();
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    const handleEdit = async () => {
        if (isEdit !== true) {
            SetisEdit(!isEdit);
            return;
        }

        await axios
            .put(
                `${config.apiUrl}/note/${note.id}`,
                {
                    title: note.title,
                    content,
                    mission: note.mission,
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
                    },
                }
            )
            .then(() => {
                SetisEdit(false);
                setMessage('Saved !', 'success');
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                handleEdit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [note, content]);

    return (
        <div className="modal-wrapper">
            <div className="modal-card">
                <div className="modal">
                    <div className="modal-header">
                        <h2 className="heading">{note.title}</h2>
                        <a
                            onClick={func}
                            onKeyDown={() => func}
                            role="button"
                            className="close"
                            aria-label="close this modal"
                            tabIndex={0}
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                            </svg>
                        </a>
                    </div>
                    {isEdit && (
                        <textarea
                            rows={5}
                            required
                            className="popup-textarea modal-body"
                            onChange={takeContent}
                            value={content}
                        />
                    )}
                    {!isEdit && <p>{content}</p>}
                    {isPentester && (
                        <Stack
                            direction="row"
                            justifyContent="center"
                            mt={3}
                            spacing={4}
                        >
                            <SecondaryButton
                                variant="outlined"
                                onClick={handleDelete}
                            >
                                {isEdit ? 'Cancel' : 'Delete'}
                            </SecondaryButton>
                            <PrimaryButton
                                variant="contained"
                                color="primary"
                                onClick={handleEdit}
                            >
                                {isEdit ? 'Save' : 'Edit'}
                            </PrimaryButton>
                        </Stack>
                    )}
                </div>
                {open && (
                    <Feedbacks
                        mess={message.mess}
                        color={message.color}
                        close={close}
                        open={open}
                    />
                )}
            </div>
        </div>
    );
}

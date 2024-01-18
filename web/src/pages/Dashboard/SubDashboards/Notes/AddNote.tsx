import { Stack } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../Dashboard.scss';
import React, { useState } from 'react';
import { SecondaryButton, PrimaryButton } from '../../../../component/Button';
import config from '../../../../config';
import Feedbacks from '../../../../component/Feedback';
import { getCookiePart } from '../../../../crypto-utils';

interface AddNoteProps {
    func: React.MouseEventHandler<HTMLButtonElement>;
    missionId: number;
    missionTitle: string;
}

export default function AddNote({
    func,
    missionId,
    missionTitle,
}: AddNoteProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });

    const takeTitlee = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const close = () => {
        setOpen(false);
    };

    const takeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const handleSubmit = async (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        if (title.length === 0 || content.length === 0) {
            setMessage('Please fill the required contents', 'error');
            return;
        }
        await axios
            .post(
                `${config.apiUrl}/note`,
                {
                    title,
                    content,
                    mission: missionId,
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
                setMessage('Created!', 'success');
                func(evt);
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    return (
        <div className="modal-wrapper">
            <div className="modal-card ">
                <div className="modal centered">
                    <h2 className="heading">Add a note</h2>
                    <div className="form-group">
                        <label>Mission</label>
                        <input
                            type="text"
                            required
                            placeholder={missionTitle}
                            className="form-control"
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            required
                            placeholder={title}
                            className="form-control"
                            onChange={takeTitlee}
                            value={title}
                        />
                    </div>
                    <div className="form-group">
                        <label>Content *</label>
                        <textarea
                            rows={8}
                            required
                            placeholder="Put your note here"
                            className="form-control"
                            onChange={takeContent}
                            value={content}
                        />
                    </div>
                    <Stack
                        direction="row"
                        justifyContent="start"
                        mt={3}
                        spacing={4}
                    >
                        <SecondaryButton variant="outlined" onClick={func}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                                setOpen(true);
                                handleSubmit(e);
                            }}
                        >
                            Submit
                        </PrimaryButton>
                    </Stack>
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

import { Stack } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../Dashboard.scss';
import React, { useState } from 'react';
import { SecondaryButton, PrimaryButton } from '../../../../component/Button';
import config from '../../../../config';
import Feedbacks from '../../../../component/Feedback';

interface AddNoteProps {
    func: React.MouseEventHandler<HTMLButtonElement>;
    idMission: { id: number; title: string }[];
    count: number;
}

export default function AddNote({ func, idMission, count }: AddNoteProps) {
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
        await axios
            .post(
                `${config.apiUrl}/note`,
                {
                    title,
                    content,
                    mission: idMission[count].id,
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${Cookies.get('Token')}`,
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
                    <input
                        type="text"
                        required
                        placeholder={idMission[count].title}
                        className="popup-input"
                        readOnly
                    />
                    <input
                        type="text"
                        required
                        placeholder="Enter a title"
                        className="popup-input"
                        onChange={takeTitlee}
                        value={title}
                    />
                    <textarea
                        rows={8}
                        required
                        placeholder="Put your note here"
                        className="popup-textarea"
                        onChange={takeContent}
                        value={content}
                    />
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

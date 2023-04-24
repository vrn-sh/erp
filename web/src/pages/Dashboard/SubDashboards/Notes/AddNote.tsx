import { Stack } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../Dashboard.scss';
import React, { useState } from 'react';
import { SecondaryButton, PrimaryButton } from '../../../../component/Button';

interface AddNoteProps {
    func: React.MouseEventHandler<HTMLButtonElement>;
    idMission: { id: number; title: string }[];
    count: number;
}

export default function AddNote({ func, idMission, count }: AddNoteProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [open, setOpen] = useState(false);

    const takeTitlee = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const takeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const handleSubmit = async (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        try {
            await axios
                .post(
                    `http://localhost:8080/note`,
                    {
                        title,
                        content,
                        mission: idMission[count].id,
                    },
                    {
                        headers: {
                            Authorization: `Token ${Cookies.get('Token')}`,
                        },
                    }
                )
                .then(() => {
                    setOpen(true);
                    func(evt);
                })
                .catch(() => {
                    setOpen(!open);
                });
        } catch (error) {
            console.log(error);
        }
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
                            onClick={handleSubmit}
                        >
                            Submit
                        </PrimaryButton>
                    </Stack>
                </div>
            </div>
        </div>
    );
}

import { Stack } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../Dashboard/Dashboard.scss';
import React, { useState } from 'react';
import { SecondaryButton, PrimaryButton } from '../../component/Button';
import config from '../../config';
import Feedbacks from '../../component/Feedback';
import { getCookiePart } from '../../crypto-utils';

interface AddNmapProps {
    idRecon: number;
    func: React.MouseEventHandler<HTMLButtonElement>;
}

export default function AddNMAP({ idRecon, func }: AddNmapProps) {
    const [content, setContent] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });

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
                `${config.apiUrl}/nmap`,
                {
                    recon_id: idRecon,
                    nmap_file: content,
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
                    <h2 className="heading">Add an nmap scan trace</h2>
                    <textarea
                        rows={8}
                        required
                        placeholder="Put your nmap trace here"
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

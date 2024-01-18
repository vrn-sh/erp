import { Stack } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import config from '../config';
import { SecondaryButton, PrimaryButton } from './Button';
import Feedbacks from './Feedback';
import '../pages/Dashboard/Dashboard.scss';
import { getCookiePart } from '../crypto-utils';

interface DeleteProps {
    func: any;
    item: { id: number; title: string; type: string };
}

export default function DeleteConfirm({ func, item }: DeleteProps) {
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    /* eslint-disable */
    function timeout(delay: number) {
        return new Promise((res) => setTimeout(res, delay));
    }
    /* eslint-enable */

    const handleDelete = async () => {
        await axios
            .delete(`${config.apiUrl}/${item.type}/${item.id}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then(async () => {
                setMessage('Deleted !', 'success');
                await timeout(1000);
                window.location.reload();
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    return (
        <div className="modal-wrapper">
            <div className="modal-card">
                <div className="modal">
                    <div className="modal-header">
                        <h2 className="centered">{item.title}</h2>
                    </div>
                    <p className="centered">
                        Are you sure you want to delete this {item.type} ?
                    </p>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        mt={3}
                        spacing={4}
                    >
                        <SecondaryButton variant="outlined" onClick={func}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                handleDelete();
                                setOpen(true);
                            }}
                        >
                            Delete
                        </PrimaryButton>
                    </Stack>
                </div>
            </div>
            {open && (
                <Feedbacks
                    mess={message.mess}
                    color={message.color}
                    open={open}
                    close={handleClose}
                />
            )}
        </div>
    );
}

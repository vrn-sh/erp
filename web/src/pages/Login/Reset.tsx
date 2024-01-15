import React, { useState } from 'react';
import axios from 'axios';
import * as MdIcons from 'react-icons/md';
import config from '../../config';
import './Login.scss';
import Feedbacks from '../../component/Feedback';

export default function Reset() {
    const [resetPassword, setResetPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const close = () => {
        setOpen(false);
    };
    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const handlePasswordReset = async () => {
        setOpen(true);
        if (resetPassword.length > 7) {
            await axios
                .post(`${config.apiUrl}/reset?token=${token}`, {
                    password: resetPassword,
                })
                .then(() => {
                    setIsSuccess(true);
                    setMessage('Succeed', 'success');
                })
                .catch((error) => {
                    setMessage(
                        'Invalid token or password, please try again',
                        'error'
                    );
                    setIsSuccess(false);
                    throw error;
                });
        } else {
            setMessage('Password must be 8 characters long!', 'error');
        }
    };

    return (
        <section className="signup-container">
            <div className="signup-text" id="signup-text">
                <div>
                    <h2>voron</h2>
                    <h1>In efficiency we trust</h1>
                </div>
            </div>

            <div className="signup-form" id="signup-form">
                <div className="wrapper-log">
                    <MdIcons.MdMarkEmailRead style={{ fontSize: '3rem' }} />
                    {isSuccess ? (
                        <>
                            <h1>
                                Thanks to confirm the email, sign up succeed!
                            </h1>
                            <h5>
                                <a href="/login">
                                    Click here to log in please.
                                </a>
                            </h5>
                        </>
                    ) : (
                        <>
                            <h1>Please enter your new password</h1>
                            <input
                                className="form-control"
                                style={{ margin: '10px', width: '40em' }}
                                type="password"
                                value={resetPassword}
                                onChange={(e) =>
                                    setResetPassword(e.target.value)
                                }
                                placeholder="Enter your new password"
                            />
                            <button
                                type="button"
                                style={{ minWidth: '10px' }}
                                onClick={handlePasswordReset}
                            >
                                Reset password
                            </button>
                        </>
                    )}
                </div>
            </div>
            {open && (
                <Feedbacks
                    mess={message.mess}
                    color={message.color}
                    close={close}
                    open={open}
                />
            )}
        </section>
    );
}

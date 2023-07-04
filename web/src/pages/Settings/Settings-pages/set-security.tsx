import React, { useState } from 'react';
import { Stack } from '@mui/material';
import * as AiIcons from 'react-icons/ai';
import '../Settings.scss';
import Feedbacks from '../../../component/Feedback';
import { PrimaryButton, SecondaryButton } from '../../../component/Button';

export default function SettingSecurity() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    // Variables de mot de passes
    const [currentPwdType, setCurrentPwdType] = useState('password');
    const [newPwdType, setNewPwdType] = useState('password');
    const [confirmPwdType, setConfirmPwdType] = useState('password');
    const [currentPwdIcon, setCurrentPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );
    const [newPwdIcon, setNewPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );
    const [confirmPwdIcon, setConfirmPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );
    const [popUp, setPopUp] = useState(false);

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

    const pwdChangeApi = async () => {
        // await axios(`${config.apiUrl}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-type': 'application/json',
        //         Authorization: `Token ${Cookies.get('Token')}`,
        //     },
        //     maxBodyLength: Infinity,
        // })
        // .then((e) => {
        //     setMessage('Changed password successfully!', 'success');
        // })
        // .catch((e) => {
        //     setMessage('The actual password is incorrect.', 'error');
        //     console.log(e);
        // })
    };

    const submitChangePwd = async () => {
        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
            // || currentPassword != the Right Password
        ) {
            setOpen(true);
            setMessage(
                'Please check all the password were filled correctly',
                'error'
            );
        } else {
            setOpen(true);
            pwdChangeApi();
            setPopUp(true);
        }
        // Si les mot de passes sont correctes, alors faire la demande d'api pour
        // reset le mot de passe
    };

    const confirmUpdate = () => {
        setOpen(true);
        pwdChangeApi();
        setMessage('Email verification sent', 'success');
    };

    return (
        <div>
            {open && (
                <Feedbacks
                    mess={message.mess}
                    color={message.color}
                    open={open}
                    close={handleClose}
                />
            )}
            <span className="left-side">
                <h1>Security</h1>
            </span>
            <h3 style={{ textAlign: 'left' }}>Change your password</h3>
            <div className="secu-container">
                <Stack spacing={5}>
                    <div className="pwd">
                        <label>Actual password</label>
                        <input
                            id="input_pwd"
                            type={currentPwdType}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <i
                            role="presentation"
                            onClick={() => {
                                if (currentPwdType === 'password') {
                                    setCurrentPwdType('text');
                                    setCurrentPwdIcon(<AiIcons.AiOutlineEye />);
                                } else {
                                    setCurrentPwdType('password');
                                    setCurrentPwdIcon(
                                        <AiIcons.AiOutlineEyeInvisible />
                                    );
                                }
                            }}
                            onKeyDown={() => {}}
                            className="pwdEyeBtn"
                        >
                            {currentPwdIcon}
                        </i>
                    </div>

                    <div className="pwd">
                        <label>New password</label>
                        <input
                            id="input_pwd"
                            type={newPwdType}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <i
                            role="presentation"
                            onClick={() => {
                                if (newPwdType === 'password') {
                                    setNewPwdType('text');
                                    setNewPwdIcon(<AiIcons.AiOutlineEye />);
                                } else {
                                    setNewPwdType('password');
                                    setNewPwdIcon(
                                        <AiIcons.AiOutlineEyeInvisible />
                                    );
                                }
                            }}
                            onKeyDown={() => {}}
                            className="pwdEyeBtn"
                        >
                            {newPwdIcon}
                        </i>
                    </div>

                    <div className="pwd">
                        <label>Confirm the new password</label>
                        <input
                            id="input_pwd"
                            type={confirmPwdType}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <i
                            role="presentation"
                            onClick={() => {
                                if (confirmPwdType === 'password') {
                                    setConfirmPwdType('text');
                                    setConfirmPwdIcon(<AiIcons.AiOutlineEye />);
                                } else {
                                    setConfirmPwdType('password');
                                    setConfirmPwdIcon(
                                        <AiIcons.AiOutlineEyeInvisible />
                                    );
                                }
                            }}
                            onKeyDown={() => {}}
                            className="pwdEyeBtn"
                        >
                            {confirmPwdIcon}
                        </i>
                    </div>
                </Stack>
            </div>
            <button
                type="submit"
                onClick={submitChangePwd}
                className="secu-btn"
                style={{ marginTop: '1.5rem' }}
            >
                Submit
            </button>
            {popUp && (
                <div className="modal-wrapper">
                    <div className="modal-card modal-card-secu">
                        <div className="modal">
                            <AiIcons.AiOutlineMail
                                className="centered"
                                style={{ fontSize: '2rem' }}
                            />
                            <h1 className="centered">
                                Please check your mail to finish the password
                                update.
                            </h1>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                mt={3}
                                spacing={4}
                            >
                                <SecondaryButton
                                    variant="outlined"
                                    onClick={() => setPopUp(false)}
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton
                                    variant="contained"
                                    color="primary"
                                    onClick={confirmUpdate}
                                >
                                    Didn't receive, send again
                                </PrimaryButton>
                            </Stack>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

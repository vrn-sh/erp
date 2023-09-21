import React, { useEffect, useState } from 'react';
import '../Settings.scss';
import Cookies from 'js-cookie';
import { Stack } from '@mui/material';
import * as AiIcons from 'react-icons/ai';
import axios from 'axios';
import Feedbacks from '../../../component/Feedback';
import config from '../../../config';

export default function SecurityUser() {
    const role = Cookies.get('Role');
    const id = Cookies.get('Id');
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        profile_image: '',
        phone_number: '',
    });
    const [open, setOpen] = useState(false);
    const [url, setURL] = useState(`${config.apiUrl}/`);
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPwdType, setNewPwdType] = useState('password');
    const [confirmPwdType, setConfirmPwdType] = useState('password');
    const [newPwdIcon, setNewPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );
    const [confirmPwdIcon, setConfirmPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );

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

    const getUserInfo = async () => {
        let urltmp = `${config.apiUrl}/`;
        if (role === '2') urltmp += 'manager';
        else urltmp += 'pentester';
        setURL(urltmp);
        await axios
            .get(`${urltmp}/${id}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                setUserInfo(data.data.auth);
            })
            .catch((e) => {
                throw e;
            });
    };

    const handleSubmit = async () => {
        setOpen(true);
        await axios
            .patch(
                `${url}/${id}`,
                JSON.stringify({
                    auth: {
                        password: confirmPassword,
                    },
                }),
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${Cookies.get('Token')}`,
                    },
                }
            )
            .then(() => {
                setMessage('Changed password successfully!', 'success');
            })
            .catch((e) => {
                setMessage('The actual password is incorrect.', 'error');
                throw e;
            });
    };

    const CheckCurrentPassword = async () => {
        setOpen(true);
        let value = false;

        await axios
            .post(
                `${url}/${id}`,
                JSON.stringify({
                    email: userInfo.email,
                    password: currentPassword,
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then(() => {
                value = true;
            })
            .catch((e) => {
                value = false;
            });

        return value;
    };

    const submitChangePwd = async () => {
        if (
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
        ) {
            setOpen(true);
            setMessage(
                'Please check all the password were filled correctly',
                'error'
            );
        } else if (newPassword.length < 8 || confirmPassword.length < 8) {
            setOpen(true);
            setMessage('A password should have at least 8 characters', 'error');
        } else if (await CheckCurrentPassword()) {
            setOpen(true);
            setMessage('Your current password is not correct', 'error');
        } else handleSubmit();
    };

    useEffect(() => {
        getUserInfo();
    }, []);

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
            <div style={{ marginTop: '3em' }}>
                <Stack spacing={5}>
                    <div className="pwd">
                        <label>Current password</label>
                        <input
                            id="input_pwd"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
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
        </div>
    );
}

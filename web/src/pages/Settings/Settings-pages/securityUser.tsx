import React, { useEffect, useState } from 'react';
import '../Settings.scss';
import Cookies from 'js-cookie';
import { Stack } from '@mui/material';
import * as AiIcons from 'react-icons/ai';
import axios from 'axios';
import { GrSecure } from 'react-icons/gr';
import Feedbacks from '../../../component/Feedback';
import config from '../../../config';
import { getCookiePart } from '../../../crypto-utils';

export default function SecurityUser() {
    const role = getCookiePart(Cookies.get('Token')!, 'role')?.toString();
    const id = Number(getCookiePart(Cookies.get('Token')!, 'id'));
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
        has_otp: false,
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
    const [mfaCode, setMfaCode] = useState('');
    const [codeValidation, setCodeValidation] = useState([
        '',
        '',
        '',
        '',
        '',
        '',
    ]);
    const [showMfaPopup, setShowMfaPopup] = useState(false);
    const [isCodeIncorrect, setIsCodeIncorrect] = useState(false); // État pour suivre si le code est incorrect

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

    const updateUserInfo = async (infos: object) => {
        let urltmp = `${config.apiUrl}/`;
        if (role === '2') urltmp += 'manager';
        else if (role === '3') urltmp += 'freelancer';
        else urltmp += 'pentester';
        setURL(urltmp);
        await axios
            .patch(
                `${urltmp}/${id}`,
                {
                    auth: {
                        ...infos,
                    },
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
            .then((data) => {
                setUserInfo(data.data.auth);
            })
            .catch((e) => {
                throw e;
            });
    };

    const handleMfaCheckbox = () => {
        if (userInfo.has_otp) {
            setMfaCode('');
            updateUserInfo({ has_otp: false });
        } else {
            axios
                .get(`${config.apiUrl}/mfa`, {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
                    },
                })
                .then((data) => {
                    setMfaCode(data.data.mfa_code);
                    setShowMfaPopup(true);
                })
                .catch((e) => {
                    throw e;
                });
        }
    };

    const inputRefs = Array.from({ length: 6 }, () =>
        React.createRef<HTMLInputElement>()
    );

    const handleCodeInput = (index: number, value: string) => {
        const newCodeValidation = [...codeValidation];
        newCodeValidation[index] = value;
        setCodeValidation(newCodeValidation);

        const code = newCodeValidation.join('');
        if (index < inputRefs.length - 1 && value) {
            inputRefs[index + 1].current?.focus();
        }
        setMfaCode(code);
    };

    const handleVerifyCode = () => {
        axios
            .post(
                `${config.apiUrl}/mfa?mfa_code=${mfaCode}`,
                {},
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
                updateUserInfo({ has_otp: true });
                setShowMfaPopup(false);
            })
            .catch((e) => {
                setIsCodeIncorrect(true);
                setCodeValidation(['', '', '', '', '', '']);
                throw e;
            });
    };

    const getUserInfo = async () => {
        let urltmp = `${config.apiUrl}/`;
        if (role === '2') urltmp += 'manager';
        else if (role === '3') urltmp += 'freelancer';
        else urltmp += 'pentester';
        setURL(urltmp);
        await axios
            .get(`${urltmp}/${id}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
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
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
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
        setOpen(true);
        if (
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
        ) {
            setMessage(
                'Please check all the password were filled correctly',
                'error'
            );
        } else if (newPassword.length < 8 || confirmPassword.length < 8) {
            setMessage('A password should have at least 8 characters', 'error');
        } else if (await CheckCurrentPassword()) {
            setMessage('Your current password is not correct', 'error');
        } else handleSubmit();
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                setOpen(true);
                submitChangePwd();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [newPassword, confirmPassword]);

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
            <div
                style={{
                    marginTop: '1em',
                    borderRadius: '5px',
                    border: 'solid 2px',
                }}
            >
                <h2>Keep your account secure</h2>
                <p style={{ fontSize: '10px' }}>
                    Protecting your account is crucial. To enhance the security
                    of your personal information, activate two-factor
                    authentication (2FA) now. This makes it harder for hackers
                    to access your account, even if your credentials are
                    compromised. Take a moment to enable 2FA in your security
                    settings.
                </p>
                <div>
                    <input
                        type="checkbox"
                        checked={userInfo.has_otp}
                        onChange={handleMfaCheckbox}
                    />
                    <label style={{ marginLeft: '0.5em' }}>Activer MFA</label>
                </div>
            </div>
            {showMfaPopup && (
                <div
                    className="popup-container"
                    style={{ backgroundColor: 'black' }}
                >
                    <div className="popup">
                        <div
                            style={{
                                width: '500px',
                                height: '400px',
                                borderRadius: '8px',
                                padding: '20px',
                                display: 'block',
                                backgroundColor: 'white',
                                textAlign: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <GrSecure size={50} style={{ color: 'blue' }} />
                            <h3>Authentificate you account</h3>
                            <p style={{ fontSize: '12px' }}>
                                Your online protection is our priority, and
                                we're here to help make your account safer.
                            </p>
                            <p>
                                Please enter the code sent to your email address
                            </p>
                            <div
                                className="mfa-code-input"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '10px',
                                }}
                            >
                                {Array.from({ length: 6 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={codeValidation[index]}
                                        onChange={(e) =>
                                            handleCodeInput(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        ref={inputRefs[index]}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            marginRight: '10px',
                                            textAlign: 'center',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                        }}
                                    />
                                ))}
                            </div>
                            {isCodeIncorrect && (
                                <p style={{ color: 'red', marginTop: '5px' }}>
                                    Incorrect code. Try Again.
                                </p>
                            )}
                            <div style={{ marginTop: '20px' }}>
                                <button
                                    type="button"
                                    onClick={handleVerifyCode}
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

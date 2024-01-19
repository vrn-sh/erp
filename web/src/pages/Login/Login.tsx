import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import axios from 'axios';
import './Login.scss';
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import config from '../../config';
import { createCookie, getCookiePart } from '../../crypto-utils';
import Feedbacks from '../../component/Feedback';

export default function Login() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPwd, setErrorPwd] = useState('');
    const [pwdType, setPwdType] = useState('password');
    const [pwdIcon, setPwdIcon] = useState(<AiIcons.AiOutlineEyeInvisible />);
    const navigate = useNavigate();

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

    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const handlePasswordReset = async () => {
        setOpen(true);
        await axios
            .put(`${config.apiUrl}/reset`, {
                email: resetEmail,
            })
            .then((date) => {
                setMessage('Please check your email', 'success');
            })
            .catch((e) => {
                setMessage('Please enter correct email', 'error');
            });
    };

    const toggleResetModal = () => {
        setIsResetModalOpen(!isResetModalOpen);
    };

    const handleShowPwd = () => {
        if (pwdType === 'password') {
            setPwdType('text');
            setPwdIcon(<AiIcons.AiOutlineEye />);
        } else {
            setPwdType('password');
            setPwdIcon(<AiIcons.AiOutlineEyeInvisible />);
        }
    };

    const sendMfaCode = async () => {
        await axios
            .get(`${config.apiUrl}/mfa`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then(() => {
                navigate('/mfa_check');
            })
            .catch((e) => {
                throw e;
            });
    };

    const getUserInfos = async () => {
        let url = `${config.apiUrl}/`;
        if (getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '3') {
            url += 'freelancer';
        } else if (
            getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '2'
        ) {
            url += 'manager';
        } else {
            url += 'pentester';
        }
        await axios
            .get(`${url}/${getCookiePart(Cookies.get('Token')!, 'id')}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                if (data.data.auth.has_otp === true) sendMfaCode();
                else navigate('/info');
            })
            .catch((e) => {
                throw e;
            });
    };

    const submit = async () => {
        setOpen(true);
        if (email !== '' && pwd.length > 7) {
            try {
                await axios
                    .post(
                        `${config.apiUrl}/login`,
                        JSON.stringify({
                            email,
                            password: pwd,
                        }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    )
                    .then((e) => {
                        Cookies.set(
                            'Token',
                            createCookie(e.data.id, e.data.token, e.data.role),
                            {
                                expires: Date.parse(e.data.expiry),
                            }
                        );
                        getUserInfos();
                    })
                    .catch(() => {
                        setErrorEmail('Invalid email or password!');
                    });
            } catch (error) {
                setErrorEmail('Invalid email or password!');
            }
        } else {
            setMessage('Invalid email or password!', 'error');
        }
    };

    // Handle submit when click 'enter' on keyboard
    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                submit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [email, pwd]);

    return (
        <section className="login-container">
            <div className="login-text" id="login-text">
                <div>
                    <h2>voron</h2>
                    <h1>In efficiency we trust</h1>
                </div>
            </div>

            <div className="login-form" id="login-form">
                <div className="wrapper">
                    <div className="form-wrapper">
                        <h2>Welcome back !</h2>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Password</label>
                            <div className="input-pwd">
                                <input
                                    type={pwdType}
                                    className="form-control"
                                    onChange={(e) => setPwd(e.target.value)}
                                />
                                <button
                                    onClick={handleShowPwd}
                                    className="eyeIconBtn"
                                    type="button"
                                >
                                    {pwdIcon}
                                </button>
                            </div>

                            <p className="error">
                                {errorPwd} {errorEmail}
                            </p>
                            <div className="login-submit">
                                <button type="button" onClick={submit}>
                                    LOGIN
                                </button>

                                <Link to="/sign_up" className="log-box">
                                    <span>You don't have an account </span>
                                    <span className="txt-color">
                                        Sign up in here!
                                    </span>
                                </Link>
                                <div
                                    className="reset-password"
                                    onClick={toggleResetModal}
                                    onKeyDown={() => {}}
                                    role="presentation"
                                >
                                    Forgot your password ? Reset here
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isResetModalOpen}
                onRequestClose={toggleResetModal}
                contentLabel="Reset Password Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1000,
                    },
                    content: {
                        width: '30em',
                        height: '30em',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    },
                }}
            >
                <h2>Reset Password</h2>
                <p>Please enter your email address to reset your password.</p>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <input
                        className="form-control"
                        style={{ margin: '10px' }}
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <div style={{ width: '300px' }}>
                        <button
                            onClick={handlePasswordReset}
                            type="button"
                            className="form-control cursor-pointer"
                        >
                            Send Email
                        </button>
                        <button
                            onClick={toggleResetModal}
                            type="button"
                            className="form-control cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
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

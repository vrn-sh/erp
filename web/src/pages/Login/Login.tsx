import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import axios from 'axios';
import './Login.scss';
import Cookies from 'js-cookie';
import config from '../../config';
import Modal from 'react-modal';

export default function Login() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPwd, setErrorPwd] = useState('');
    const [pwdType, setPwdType] = useState('password');
    const [pwdIcon, setPwdIcon] = useState(<AiIcons.AiOutlineEyeInvisible />);
    const navigate = useNavigate();
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetFeedback, setResetFeedback] = useState(''); // State to store feedback message

    // Function to handle password reset submission
    const handlePasswordReset = async () => {
        try {
            const response = await axios.put(`${config.apiUrl}/reset`, {
                email: resetEmail
            });

            // Display feedback based on the response
            setResetFeedback(response.data.message);
            console.log(response.data.message);
        } catch (error) {
            // Handle error scenario
            setResetFeedback('Error sending reset instructions. Please try again.');
        }
    };

    const toggleResetModal = () => {
        setIsResetModalOpen(!isResetModalOpen);
    };

    const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setErrorEmail('Please enter valid email address.');
        } else if (/^\S+@\S+\.\S+$/.test(email)) {
            setErrorEmail('');
        }
    };

    const checkPwd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(e.target.value);

        if (pwd.length < 7) {
            setErrorPwd('Password should have at least 8 characters.');
        } else {
            setErrorPwd('');
        }
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

    const submit = async () => {
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
                        navigate('/dashboard');
                        Cookies.set('Token', e.data.token, {
                            expires: Date.parse(e.data.expiry),
                        });
                        Cookies.set('Role', e.data.role, {
                            expires: Date.parse(e.data.expiry),
                        });
                        Cookies.set('Id', e.data.id, {
                            expires: Date.parse(e.data.expiry),
                        });
                    })
                    .catch(() => {
                        setErrorEmail('Invalid email or password!');
                    });
            } catch (error) {
                setErrorEmail('Invalid email or password!');
            }
        }
    };

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
                                onChange={checkEmail}
                            />
                            <label>Password</label>
                            <div className="input-pwd">
                                <input
                                    type={pwdType}
                                    className="form-control"
                                    onChange={checkPwd}
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
                                <div className="forgot-password log-box" onClick={toggleResetModal}>
                                    <span className="txt-color">
                                        reset my password
                                    </span>
                            </div>
                            <Modal
                                isOpen={isResetModalOpen}
                                onRequestClose={toggleResetModal}
                                contentLabel="Reset Password Modal"
                                style={{
                                    overlay: {
                                        backgroundColor: 'rgba(0, 0, 0, 0.75)', // This will create a semi-transparent black background
                                        zIndex: 1000, // This will bring the modal to the front
                                    },
                                    content: {
                                        // Add your content styles here
                                    },
                                }}
                            >
                                <h2>Reset Password</h2>
                                <p>Please enter your email address to reset your password.</p>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    // Add any additional input styles
                                />
                                <button onClick={handlePasswordReset}>Send Email</button>
                                <p>{resetFeedback}</p> {/* Feedback message */}
                                <button onClick={toggleResetModal}>Close</button>
                            </Modal>

                                <button type="button" onClick={submit}>
                                    LOGIN
                                </button>
                                <Link to="/sign_up" className="log-box">
                                    <span>You don't have an account </span>
                                    <span className="txt-color">
                                        Sign up in here!
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

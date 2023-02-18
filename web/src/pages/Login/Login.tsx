import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import './Login.scss';

const REGEX = /^\S+@\S+\.\S+$/;

export default function Login() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPwd, setErrorPwd] = useState('');
    const [pwdType, setPwdType] = useState('password');
    const [pwdIcon, setPwdIcon] = useState(eyeOff);

    const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);

        if (!REGEX.test(email)) {
            setErrorEmail('Please enter valid email address.');
        } else if (REGEX.test(email)) {
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
            setPwdIcon(eye);
        } else {
            setPwdType('password');
            setPwdIcon(eyeOff);
        }
    };

    const submit = () => {
        if (email !== '' && pwd.length > 7) {
            // TODO: Integrate login
        } else {
            // TODO: Error handling
        }
    };

    return (
        <section className="login-container">
            <div className="login-text" id="login-text">
                <div>
                    <h2>voron</h2>
                    <h1>{import.meta.env.VITE_REACT_APP_SLOGAN}</h1>
                    <span className="no-bold">
                        Lorem ipsum dolor sit amet consectetur. Quis platea
                        lectus.
                    </span>
                </div>
            </div>

            <div className="login-form" id="login-form">
                <div className="wrapper">
                    <div className="form-wrapper">
                        <h2>Welcome back!</h2>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                onChange={checkEmail}
                            />
                            <p className="error">{errorEmail}</p>

                            <label htmlFor="input">Password</label>
                            <div className="input-pwd">
                                <input
                                    type={pwdType}
                                    className="form-control"
                                    onChange={checkPwd}
                                />
                                <button
                                    className="not-a-button"
                                    type="button"
                                    onClick={handleShowPwd}
                                >
                                    <Icon icon={pwdIcon} />
                                </button>
                            </div>
                            <p className="error">{errorPwd}</p>

                            <div className="submit">
                                <button
                                    className="submit-button"
                                    type="button"
                                    onClick={submit}
                                >
                                    LOG IN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

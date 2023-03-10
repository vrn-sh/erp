import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import './Login.scss';

export default function Login() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPwd, setErrorPwd] = useState('');
    const [pwdType, setPwdType] = useState('password');
    const [pwdIcon, setPwdIcon] = useState(<AiIcons.AiOutlineEyeInvisible />);
    const navigate = useNavigate();

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

    const submit = () => {
        if (email !== '' && pwd.length > 7) {
            // console.log('Log in successfully!')
            navigate('/dashboard');
        } else {
            //    console.log('Something is wrong')
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
                                <p>Forgot password ? </p>
                                <button type="button" onClick={submit}>
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

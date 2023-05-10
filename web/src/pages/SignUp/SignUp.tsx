import React, { useEffect, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import './SignUp.scss';
import axios from 'axios';
import config from '../../config';
import Feedbacks from '../../component/Feedback';

const Regex = /^\s?[A-Z0-9]+[A-Z0-9._+-]{0,}@[A-Z0-9._+-]+\.[A-Z0-9]{2,4}\s?$/i;

interface SignUpState {
    username: string;
    email: string;
    password: string;
    role: string;
    confirmpassword: string;
    errors: {
        username: string;
        email: string;
        password: string;
        role: string;
        confirmpassword: string;
    };
}

export default function SignUp() {
    const [pwdIcon, setPwdIcon] = useState(<AiIcons.AiOutlineEyeInvisible />);
    const [popUp, setPopUp] = useState(false);
    const [conPwdIcon, setConPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );
    const [pwdType, setPwdType] = useState('password');
    const [conPwdType, setConPwdType] = useState('password');
    const [state, setState] = useState<SignUpState>({
        username: '',
        email: '',
        password: '',
        role: 'pentester',
        confirmpassword: '',
        errors: {
            username: '',
            email: '',
            password: '',
            role: '',
            confirmpassword: '',
        },
    });
    const { errors } = state;
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { name, value } = event.target;
        switch (name) {
            case 'email':
                errors.email = Regex.test(value) ? '' : 'Email is not valid!';
                break;
            case 'username':
                errors.username =
                    value.length < 5
                        ? 'Username must be 5 characters long!'
                        : '';
                break;
            case 'role':
                errors.role = value.length === 0 ? 'Please choose a role' : '';
                break;
            case 'password':
                errors.password =
                    value.length < 8
                        ? 'Password must be eight characters long!'
                        : '';
                break;
            case 'confirmpassword':
                errors.confirmpassword =
                    value !== state.password
                        ? 'Password and Confirm Password does not match'
                        : '';
                break;
            default:
                break;
        }
        setState({ ...state, errors, [name]: value });
    };

    useEffect(() => {
        localStorage.setItem('user_info', JSON.stringify(state));
    }, [state]);

    const submit = async () => {
        const { username, email, role, password } = state;
        setOpen(true);
        if (email !== '' && password.length > 7 && username.length > 4) {
            try {
                await axios
                    .post(`${config.apiUrl}/register`, {
                        auth: {
                            username,
                            email,
                            role,
                            password,
                        },
                    })
                    .then(() => {
                        setMessage('Email verification sent', 'success');
                        setPopUp(true);
                    })
                    .catch(() => {
                        setState({
                            ...state,
                            errors: {
                                ...state.errors,
                                email: 'Email or username already exists!',
                            },
                        });
                    });
            } catch (error) {
                setState({
                    ...state,
                    errors: {
                        ...state.errors,
                        email: 'Email or username already exists!',
                    },
                });
            }
        }
    };

    const confirmUpdate = async () => {
        try {
            setOpen(true);
            await axios
                .put(`${config.apiUrl}/confirm`, {
                    email: state.email,
                })
                .then(() => {
                    setMessage('Email verification sent', 'success');
                })
                .catch(() => {});
        } catch (e) {
            console.log(e);
        }
    };

    const handleShowPassword = () => {
        if (pwdType === 'password') {
            setPwdType('text');
            setPwdIcon(<AiIcons.AiOutlineEye />);
        } else {
            setPwdType('password');
            setPwdIcon(<AiIcons.AiOutlineEyeInvisible />);
        }
    };

    const handleShowconfirmPassword = () => {
        if (conPwdType === 'password') {
            setConPwdType('text');
            setConPwdIcon(<AiIcons.AiOutlineEye />);
        } else {
            setConPwdType('password');
            setConPwdIcon(<AiIcons.AiOutlineEyeInvisible />);
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
                    <div className="form-wrapper-log">
                        <span className="welcom">
                            <h2>Welcome to voron</h2>
                        </span>
                        <form
                            onSubmit={submit}
                            noValidate
                            className="form-signup"
                        >
                            <div className="input-block">
                                <label
                                    className="placeholder"
                                    htmlFor="username"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-block">
                                <label className="placeholder" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="role-choose">
                                <div className="radio-container">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="pentester"
                                        checked={state.role === 'pentester'}
                                        onChange={handleChange}
                                    />
                                    <label>Pentester</label>
                                </div>
                                <div className="radio-container">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="manager"
                                        checked={state.role === 'manager'}
                                        onChange={handleChange}
                                    />
                                    <label>Manager</label>
                                </div>
                            </div>
                            <div className="input-block">
                                <label
                                    className="placeholder"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    type={pwdType}
                                    name="password"
                                    id="password"
                                    onChange={handleChange}
                                />
                                <button
                                    onClick={handleShowPassword}
                                    className="i"
                                    type="button"
                                >
                                    {pwdIcon}
                                </button>
                            </div>
                            <div className="input-block">
                                <label
                                    className="placeholder"
                                    htmlFor="Confirmpassword"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type={conPwdType}
                                    name="confirmpassword"
                                    onChange={handleChange}
                                />
                                <button
                                    onClick={handleShowconfirmPassword}
                                    className="i"
                                    type="button"
                                >
                                    {conPwdIcon}
                                </button>
                            </div>

                            <div className="error">
                                {errors.username.length > 0 && (
                                    <>
                                        <span style={{ color: 'red' }}>
                                            {errors.username}
                                        </span>
                                        <br />
                                    </>
                                )}
                                {errors.email.length > 0 && (
                                    <>
                                        <span style={{ color: 'red' }}>
                                            {errors.email}
                                        </span>
                                        <br />
                                    </>
                                )}
                                {errors.password.length > 0 && (
                                    <>
                                        <span style={{ color: 'red' }}>
                                            {errors.password}
                                        </span>
                                        <br />
                                    </>
                                )}
                                {errors.confirmpassword.length > 0 && (
                                    <>
                                        <span style={{ color: 'red' }}>
                                            {errors.confirmpassword}
                                        </span>
                                        <br />
                                    </>
                                )}
                            </div>
                            <div className="submit">
                                <button type="button" onClick={submit}>
                                    SIGN UP
                                </button>
                            </div>
                            <div className="log-box">
                                <span>Already have an account? </span>
                                <span className="txt-color">Log in here!</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {popUp && (
                <div className="signup_popup">
                    {open && (
                        <Feedbacks
                            mess={message.mess}
                            color={message.color}
                            open={open}
                            close={handleClose}
                        />
                    )}
                    <div className="signup_popup-overlay">
                        <AiIcons.AiOutlineMail />
                        <h1>Please check your mail to finish the sign up.</h1>
                        <button
                            type="button"
                            className="sendBtn"
                            onClick={confirmUpdate}
                        >
                            Didn't receive, send again
                        </button>
                        <button
                            type="button"
                            className="cancelBtn"
                            onClick={() => setPopUp(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

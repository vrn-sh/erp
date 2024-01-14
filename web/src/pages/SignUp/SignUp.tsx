import React, { useEffect, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import './SignUp.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';
import config from '../../config';
import Feedbacks from '../../component/Feedback';
import { PrimaryButton, SecondaryButton } from '../../component/Button';
import '../Dashboard/Dashboard.scss';

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
        setOpen(true);
        const { username, email, role, password } = state;
        if (password.length < 8) {
            setMessage('Password should has at least 8 characters', 'error');
            return;
        }
        if (email === '') {
            setMessage('Please enter an email', 'error');
            return;
        }
        if (username.length < 3) {
            setMessage('username should has at least 3 characters', 'error');
            return;
        }

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
            .catch((e: any) => {
                setMessage(
                    String(Object.values(e.response.data.auth)[0]),
                    'error'
                );
            });
    };

    const confirmUpdate = async () => {
        setOpen(true);
        await axios
            .put(`${config.apiUrl}/confirm`, {
                email: state.email,
            })
            .then(() => {
                setMessage('Email verification sent', 'success');
            })
            .catch((e) => {
                setMessage(e.response.data.error, 'error');
            });
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
    }, [state]);

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
                            <div className="role-choose">
                                <div className="radio-container">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="pentester"
                                        checked={state.role === 'pentester'}
                                        onChange={handleChange}
                                    />
                                    <label style={{ zIndex: 'unset' }}>
                                        Pentester
                                    </label>
                                </div>
                                <div className="radio-container">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="manager"
                                        checked={state.role === 'manager'}
                                        onChange={handleChange}
                                    />
                                    <label style={{ zIndex: 'unset' }}>
                                        Manager
                                    </label>
                                </div>
                                <div className="radio-container">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="freelancer"
                                        checked={state.role === 'freelancer'}
                                        onChange={handleChange}
                                    />
                                    <label style={{ zIndex: 'unset' }}>
                                        Freelancer
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ zIndex: 'unset' }}>
                                    Username
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="username"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ zIndex: 'unset' }}>
                                    Email Address
                                </label>
                                <input
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ zIndex: 'unset' }}>
                                    Password
                                </label>
                                <input
                                    className="form-control"
                                    type={pwdType}
                                    name="password"
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
                            <div className="form-group">
                                <label style={{ zIndex: 'unset' }}>
                                    Confirm Password
                                </label>
                                <input
                                    className="form-control"
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
                                <button type="button" onClick={confirmUpdate}>
                                    Resend confirm mail
                                </button>
                            </div>
                            <Link to="/login" className="log-box">
                                <span>Already have an account? </span>
                                <span className="txt-color">Log in here!</span>
                            </Link>
                        </form>
                    </div>
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
            {popUp && (
                <div className="modal-wrapper">
                    <div className="modal-card">
                        <div className="modal">
                            {/* <div className="modal-header"> */}
                            <AiIcons.AiOutlineMail
                                className="centered"
                                style={{ fontSize: '2rem' }}
                            />
                            <h1 className="centered">
                                Please check your mail to finish the sign up.
                            </h1>
                            {/* </div> */}
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
        </section>
    );
}

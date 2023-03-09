import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import './SignUp.scss';
import axios from 'axios';

const Regex = /^\s?[A-Z0-9]+[A-Z0-9._+-]{0,}@[A-Z0-9._+-]+\.[A-Z0-9]{2,4}\s?$/i;

interface SignUpState {
    username: string;
    email: string;
    password: string;
    confirmpassword: string;
    errors: {
        username: string;
        email: string;
        password: string;
        confirmpassword: string;
    };
}

export default function SignUp() {
    const [pwdIcon, setPwdIcon] = useState(<AiIcons.AiOutlineEyeInvisible />);
    const [conPwdIcon, setConPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );
    const [pwdType, setPwdType] = useState('password');
    const [conPwdType, setConPwdType] = useState('password');
    const [state, setState] = useState<SignUpState>({
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
        errors: {
            username: '',
            email: '',
            password: '',
            confirmpassword: '',
        },
    });
    const navigate = useNavigate();
    const { errors } = state;

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

    const submit = async () => {
        const { username, email, password } = state;
        if (email !== '' && password.length > 7 && username.length > 4) {
            try {
                await axios
                    .post('http://localhost:8000/register', {
                        auth: {
                            username,
                            email,
                            password,
                        },
                    })
                    .then(() => {
                        navigate('/dashboard');
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
                    <h2 className="alpha">voron</h2>
                    <h1>{import.meta.env.VITE_REACT_APP_SLOGAN}</h1>
                    <span className="no-bold">
                        Lorem ipsum dolor sit amet consectetur. Quis platea
                        lectus.
                    </span>
                </div>
            </div>

            <div className="signup-form" id="signup-form">
                <div className="wrapper-log">
                    <div className="form-wrapper-log">
                        <span className="welcom">
                            <h2>Welcome to voron</h2>
                        </span>
                        <form onSubmit={submit} noValidate>
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
        </section>
    );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import './SignUp.scss';

const Regex = /^\s?[A-Z0-9]+[A-Z0-9._+-]{0,}@[A-Z0-9._+-]+\.[A-Z0-9]{2,4}\s?$/i;

interface SignUpState {
    email: string;
    password: string;
    confirmpassword: string;
    errors: {
        email: string;
        password: string;
        confirmpassword: string;
    };
}

export default function SignUp() {
    const [state, setState] = useState<SignUpState>({
        email: '',
        password: '',
        confirmpassword: '',
        errors: {
            email: '',
            password: '',
            confirmpassword: '',
        },
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { name, value } = event.target;
        const { errors } = state;
        switch (name) {
            case 'email':
                errors.email = Regex.test(value) ? '' : 'Email is not valid!';
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
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Créez un objet pour stocker les données du formulaire
        // const formData = {
        //     email: state.email,
        //     password: state.password,
        //     confirmPassword: state.confirmpassword,
        // };

        // Envoyer une requête POST pour envoyer les données du formulaire à l'API
        /*  try {
          const response = await fetch('', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          if (response.ok) {
            // TODO: Integrate login
          } else {
            // TODO: Integrate error handling
          }
        } catch (error) {
          // TODO: Integrate error handling
        } */
    };

    const [pwdIcon, setPwdIcon] = useState(<AiIcons.AiOutlineEyeInvisible />);
    const [conPwdIcon, setConPwdIcon] = useState(
        <AiIcons.AiOutlineEyeInvisible />
    );
    const [pwdType, setPwdType] = useState('password');
    const [conPwdType, setConPwdType] = useState('password');
    const navigate = useNavigate();

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
    const { errors } = state;
    const submit = () => {
        navigate('/dashboard');
    };
    return (
        <section className="signup-container">
            <div className="signup-text" id="signup-text">
                <p className="text-box">
                    <span className="alpha">
                        <h1>voron</h1>
                    </span>
                    <span className="betta">
                        <h2>{import.meta.env.VITE_REACT_APP_SLOGAN}</h2>
                    </span>
                    <span className="charlie">
                        Lorem ipsum dolor sit amet consectetur. Quis platea
                        lectus.
                    </span>
                </p>
            </div>
            <div className="signup-form" id="signup-form">
                <div className="wrapper-log">
                    <div className="form-wrapper-log">
                        <span className="welcom">
                            <h2>Welcome to voron</h2>
                        </span>
                        <form onSubmit={handleSubmit} noValidate>
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
                            {errors.email.length > 0 && (
                                <span style={{ color: 'red' }}>
                                    {errors.email}
                                </span>
                            )}
                            {errors.password.length > 0 && (
                                <span style={{ color: 'red' }}>
                                    {errors.password}
                                </span>
                            )}
                            {errors.confirmpassword.length > 0 && (
                                <span style={{ color: 'red' }}>
                                    {errors.confirmpassword}
                                </span>
                            )}
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

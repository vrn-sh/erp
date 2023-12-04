import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import axios from 'axios';
import './Login.scss';
import Cookies from 'js-cookie';
import config from '../../config';
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

    const getUserInfos = async () => {
        let url = `${config.apiUrl}/`;
        if (Cookies.get('Role') === '2') url += 'manager';
        else url += 'pentester';
        await axios
            .get(`${url}/${Cookies.get('Id')}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                if (
                    data.data.auth.first_name !== null &&
                    data.data.auth.phone_number !== null
                )
                    navigate('/accueil');
                else navigate('/info');
            })
            .catch((e) => {
                throw e;
            });
    };

    const submit = async () => {
        setOpen(true);
        if (email !== '') {
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
                        setMessage('Connecting...', 'success');
                        Cookies.set('Token', e.data.token, {
                            expires: Date.parse(e.data.expiry),
                        });
                        Cookies.set('Role', e.data.role, {
                            expires: Date.parse(e.data.expiry),
                        });
                        Cookies.set('Id', e.data.id, {
                            expires: Date.parse(e.data.expiry),
                        });
                        Cookies.set('Fav', '', {
                            expires: Date.parse(e.data.expiry),
                        });
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
                                {/* <p>Forgot password ? </p> */}
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

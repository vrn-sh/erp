import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../../config';
import Feedbacks from '../../component/Feedback';

export default function MfaLogin() {
    const [codeValidation, setCodeValidation] = useState([
        '',
        '',
        '',
        '',
        '',
        '',
    ]);
    const inputRefs = Array.from({ length: 6 }, () =>
        React.createRef<HTMLInputElement>()
    );
    const [mfaCode, setMfaCode] = useState('');
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

    const getUserInfos = async () => {
        let url = `${config.apiUrl}/`;
        if (Cookies.get('Role') === '2') url += 'manager';
        else if (Cookies.get('Role') === '3') url += 'freelancer';
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
                        Authorization: `Token ${Cookies.get('Token')}`,
                    },
                }
            )
            .then(() => {
                setMessage('Succeed!', 'success');
                getUserInfos();
            })
            .catch((e) => {
                setMessage('Wrong code', 'error');
                throw e;
            });
    };

    useEffect(() => {
        axios
            .get(`${config.apiUrl}/mfa`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                setMfaCode(data.data.mfa_code);
            })
            .catch((e) => {
                setMessage('Wrong code', 'error');
                throw e;
            });
    }, []);

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
                        <h2>Double authentification check</h2>
                        <p>
                            Voron sent the verification code in your email,
                            please check
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
                                        handleCodeInput(index, e.target.value)
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
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ width: '300px', marginTop: '20px' }}>
                                <button
                                    onClick={handleVerifyCode}
                                    type="button"
                                    className="form-control cursor-pointer"
                                >
                                    Submit
                                </button>
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

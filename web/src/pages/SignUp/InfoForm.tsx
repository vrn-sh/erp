import React, { useEffect, useState } from 'react';
import './SignUp.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCamera } from 'react-icons/fa';
import config from '../../config';
import Feedbacks from '../../component/Feedback';
import '../Dashboard/Dashboard.scss';
import { getCookiePart } from '../../crypto-utils';

export default function InfoForm() {
    const role = getCookiePart(Cookies.get('Token')!, 'role')?.toString();
    const navigate = useNavigate();
    const [userInfos, setUserInfos] = useState({
        first_name: '',
        last_name: '',
        profile_image: '',
        phone_number: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    const convertImageToBase64 = (file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
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
            .get(
                `${url}/${Number(getCookiePart(Cookies.get('Token')!, 'id'))}`,
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
                    },
                }
            )
            .then((data) => {
                setUserInfos(data.data.auth);
            })
            .catch((e) => {
                throw e;
            });
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfos({ ...userInfos, first_name: e.target.value });
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfos({ ...userInfos, last_name: e.target.value });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfos({ ...userInfos, phone_number: e.target.value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log(
                'userInfos.profile_image avant la conversion :',
                userInfos.profile_image
            );

            const base64Image = await convertImageToBase64(file);

            // Vérifiez que le résultat de la conversion en base64 est une chaîne (string)
            if (typeof base64Image === 'string') {
                setUserInfos({ ...userInfos, profile_image: base64Image });
                // console.log("UserInfos.profile_image apres la conversion:", userInfos.profile_image);
            } else {
                console.error('La conversion en base64 a échoué.');
            }

            setSelectedFile(file);
        }
    };

    useEffect(() => {}, [userInfos.profile_image]);

    useEffect(() => {
        getUserInfos();
    }, [role]);

    const handleSubmit = async () => {
        setOpen(true);
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
            .patch(
                `${url}/${getCookiePart(Cookies.get('Token')!, 'id')}`,
                {
                    auth: {
                        first_name: userInfos.first_name,
                        last_name: userInfos.last_name,
                        profile_image: userInfos.profile_image,
                        phone_number: userInfos.phone_number,
                    },
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
                    },
                }
            )
            .then(() => {
                setMessage('Updated your account information!', 'success');
                navigate('/accueil');
            })
            .catch((error) => {
                setMessage(error.message, 'error');
            });
    };

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [userInfos]);

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
                            onSubmit={handleSubmit}
                            noValidate
                            className="form-signup"
                        >
                            <div className="info-profile-image-container">
                                {userInfos.profile_image ? (
                                    <img
                                        src={userInfos.profile_image} // Affichez l'image depuis l'état local
                                        alt="Profile"
                                        className="info-form-profile-image"
                                    />
                                ) : (
                                    <div className="profile-default-user-icon">
                                        <FaUser size={32} />
                                    </div>
                                )}
                                <label
                                    htmlFor="upload-photo"
                                    className="profile-image-camera-icon"
                                >
                                    <FaCamera size={20} />
                                </label>
                                <input
                                    id="upload-photo"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e)}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ zIndex: 'unset' }}>
                                    First name
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="first name"
                                    placeholder={userInfos.first_name}
                                    onChange={(e) => handleFirstNameChange(e)}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ zIndex: 'unset' }}>
                                    Last Name
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="last name"
                                    placeholder={userInfos.last_name}
                                    onChange={(e) => handleLastNameChange(e)}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ zIndex: 'unset' }}>
                                    Phone number
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="phone"
                                    placeholder={userInfos.phone_number}
                                    onChange={(e) => handlePhoneChange(e)}
                                />
                            </div>

                            <div className="submit">
                                <button type="button" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                            <Link to="/accueil" className="log-box">
                                <span>Skip</span>
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
        </section>
    );
}

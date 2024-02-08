import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Stack } from '@mui/material';
import { FaUser, FaCamera } from 'react-icons/fa';
import config from '../../../config';
import Feedbacks from '../../../component/Feedback';
import '../Settings.scss';
import { getCookiePart } from '../../../crypto-utils';

export default function SettingAccount() {
    const [userInfos, setUserInfos] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        profile_image: '', // Assurez-vous que le nom du champ correspond à votre API
    });
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Nouvel état pour le fichier sélectionné
    const role = getCookiePart(Cookies.get('Token')!, 'role')?.toString();

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
            .get(`${url}/${getCookiePart(Cookies.get('Token')!, 'id')}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                setUserInfos(data.data.auth);
            })
            .catch((e) => {
                throw e;
            });
    };

    useEffect(() => {
        getUserInfos();
    }, [role]);

    const close = () => {
        setOpen(false);
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
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

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfos({ ...userInfos, username: e.target.value });
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

    // Utilisez un effet secondaire pour surveiller les changements de userInfos.profile_image
    useEffect(() => {}, [userInfos.profile_image]);

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
                        phone_number: userInfos.phone_number,
                        profile_image: userInfos.profile_image,
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
            })
            .catch((error) => {
                setMessage(error.message, 'error');
            });
    };

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [userInfos]);

    return (
        <div className="container">
            <div
                style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto',
                    position: 'relative',
                }}
            >
                {userInfos.profile_image ? (
                    <img
                        src={userInfos.profile_image} // Affichez l'image depuis l'état local
                        alt="Profile"
                        className="profile-image"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FaUser size={32} />
                    </div>
                )}
                <label
                    htmlFor="upload-photo"
                    style={{
                        position: 'absolute',
                        bottom: '-8px',
                        right: '0',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        padding: '4px',
                        cursor: 'pointer',
                    }}
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
            <div
                style={{
                    width: '100%',
                    paddingLeft: '3rem',
                    paddingRight: '3rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div className="input input-medium">
                    <label>First name</label>
                    <input
                        id="input-first_name"
                        type="text"
                        placeholder={userInfos.first_name}
                        onChange={(e) => handleFirstNameChange(e)}
                        title="Your firstname"
                    />
                </div>
                <div className="input input-medium">
                    <label>Last name</label>
                    <input
                        id="input-last_name"
                        type="text"
                        placeholder={userInfos.last_name}
                        onChange={(e) => handleLastNameChange(e)}
                        title="Your lastname"
                    />
                </div>
                <div className="input input-medium">
                    <label>Username</label>
                    <input
                        id="input-username"
                        type="text"
                        placeholder={userInfos.username}
                        onChange={(e) => handleUsernameChange(e)}
                    />
                </div>
                <div className="input input-medium">
                    <label>Phone number</label>
                    <input
                        id="input-email"
                        type="text"
                        placeholder={userInfos.phone_number}
                        onChange={(e) => handlePhoneChange(e)}
                    />
                </div>
            </div>
            <br />

            <div className="buttons-container">
                <button type="button" className="cancel-button">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="submit-button"
                    onClick={() => {
                        handleSubmit();
                    }}
                >
                    Save Changes
                </button>
                {open && (
                    <Feedbacks
                        mess={message.mess}
                        color={message.color}
                        close={close}
                        open={open}
                    />
                )}
            </div>
        </div>
    );
}

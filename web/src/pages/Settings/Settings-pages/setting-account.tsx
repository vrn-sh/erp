import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Stack } from '@mui/material';
import config from '../../../config';
import Feedbacks from '../../../component/Feedback';
import { FaCamera, FaUser } from 'react-icons/fa';

export default function SettingAccount() {
    const [userInfos, setUserInfos] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        profile_image: '', // Assurez-vous que le nom du champ correspond à votre API
    });
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Nouvel état pour le fichier sélectionné
    const role = Cookies.get('Role');

    const getUserInfos = async () => {
        let url = `${config.apiUrl}/`;
        if (role === '2') url += 'manager';
        else url += 'pentester';
        await axios
            .get(`${url}/${Cookies.get('Id')}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
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
    }, []);

    const close = () => {
        setOpen(false);
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
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

  
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("userInfos.profile_image avant la conversion :", userInfos.profile_image);

            const base64Image = await convertImageToBase64(file);
    
            // Vérifiez que le résultat de la conversion en base64 est une chaîne (string)
            if (typeof base64Image === 'string') {
                setUserInfos({ ...userInfos, profile_image: base64Image });
               // console.log("UserInfos.profile_image apres la conversion:", userInfos.profile_image);
            } else {
                console.error("La conversion en base64 a échoué.");
            }
    
            setSelectedFile(file);
        }
    };
    
    // Utilisez un effet secondaire pour surveiller les changements de userInfos.profile_image
    useEffect(() => {
    }, [userInfos.profile_image]);
    
    
    
    
    const convertImageToBase64 = (file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    };
    

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let url = `${config.apiUrl}/`;
        if (role === '2') url += 'manager';
        else url += 'pentester';
    
        await axios
            .patch(
                `${url}/${Cookies.get('Id')}`,
                {
                    auth: {
                        first_name: userInfos.first_name,
                        last_name: userInfos.last_name,
                    },
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${Cookies.get('Token')}`,
                    },
                }
            )
            .then(() => {
                setMessage('Updated name and last name!', 'success');
            })
            .catch((error) => {
                setMessage(error.message, 'error');
            });

            if (selectedFile) {
                console.log("UserInfos.profile_image juste avant lenvoi:", userInfos.profile_image);
                    // Mettez à jour le champ profile_image avec la base64 dans la requête PATCH
                    axios
                        .patch(
                            `${url}/${Cookies.get('Id')}`,
                            {
                                auth: {
                                    profile_image: userInfos.profile_image,
                                },
                            },
                            {
                                headers: {
                                    'Content-type': 'application/json',
                                    Authorization: `Token ${Cookies.get('Token')}`,
                                },
                            }
                        )
                        .then(() => {
                            setMessage('Updated profile image!', 'success');
                        })
                        .catch((error) => {
                            setMessage(error.message, 'error');
                        });
                }
    
        };
    
      
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
            <div style={{ width: '100%' }}>
                <Stack direction="row" spacing={2}>
                    <div className="input input-medium">
                        <label>First name</label>
                        <input
                            id="input-first_name"
                            type="text"
                            value={userInfos.first_name}
                            onChange={(e) => handleFirstNameChange(e)}
                        />
                    </div>
                    <div className="input input-medium">
                        <label>Last name</label>
                        <input
                            id="input-last_name"
                            type="text"
                            value={userInfos.last_name}
                            onChange={(e) => handleLastNameChange(e)}
                        />
                    </div>
                </Stack>
                <br />
                <Stack direction="row" width="full" spacing={2}>
                    <div className="input input-medium">
                        <label>Username</label>
                        <input
                            id="input-username"
                            type="text"
                            readOnly
                            value={userInfos.username}
                            onChange={(e) => handleUsernameChange(e)}
                        />
                    </div>
                    <div className="input input-medium">
                        <label>Email</label>
                        <input
                            id="input-email"
                            type="text"
                            readOnly
                            value={userInfos.email}
                        />
                    </div>
                </Stack>
            </div>
            <br />

            <div className="buttons-container">
                <button type="button" className="cancel-button">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="submit-button"
                    onClick={(e) => {
                        setOpen(true);
                        handleSubmit(e);
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
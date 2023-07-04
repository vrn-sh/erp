import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Stack } from '@mui/material';
import config from '../../../config';
import Feedbacks from '../../../component/Feedback';
import '../Settings.scss';

export default function SettingAccount() {
    const [userInfos, setUserInfos] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
    });
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [open, setOpen] = useState(false);
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
                setMessage('Updated !', 'success');
                // getUserInfos();
            })
            .catch((error) => {
                setMessage(error.message, 'error');
            });
    };

    return (
        <div className="container">
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

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import config from '../../../config';
import { Stack } from '@mui/material';
import Feedbacks from '../../../component/Feedback';

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
    const role = Cookies.get('role');

    const getUserInfos = async () => {
        let url = `${config.apiUrl}/`;
        if (role === 'manager') url += 'manager';
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
                console.log(data.data)
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

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfos({...userInfos, email: e.target.value});
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfos({...userInfos, username: e.target.value});
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfos({...userInfos, first_name: e.target.value});
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfos({...userInfos, last_name: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let url = `${config.apiUrl}/`;
        if (role === 'manager') url += 'manager';
        else url += 'pentester';
        await axios
            .put(`${url}/${Cookies.get('Id')}`, {auth : userInfos}, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then(() => setMessage('Created!', 'success'))
            .catch((error) => {
                setMessage(error.message, 'error');
            });
    };

    return (
        <div className="setting-container">
            <div className="input-group">
                <Stack direction={'row'} spacing={'space-between'}>
                <div className="input input-medium">
                    <label>username</label>
                    <input
                        id="input-username"
                        type="text"
                        value={userInfos.username}
                        onChange={(e) => handleUsernameChange(e)}
                    />
                </div>

                <div className="input input-medium">
                    <label>email</label>
                    <input
                        id="input-email"
                        type="text"
                        value={userInfos.email}
                        onChange={(e) => handleEmailChange(e)}
                    />
                </div>
                </Stack>
                <Stack direction={'row'} spacing={'space-between'}>
                <div className="input input-medium">
                    <label>first_name</label>
                    <input
                        id="input-first_name"
                        type="text"
                        value={userInfos.first_name}
                        onChange={(e) => handleFirstNameChange(e)}
                    />
                </div>

                <div className="input input-medium">
                    <label>last_name</label>
                    <input
                        id="input-last_name"
                        type="text"
                        value={userInfos.last_name}
                        onChange={(e) => handleLastNameChange(e)}
                    />
                </div>
                </Stack>
            </div>

            <div className="buttons-container">
                <button
                    type="submit"
                    className="submit-button"
                    onClick={handleSubmit}
                >
                    Save Changes
                </button>
                <button type="button" className="cancel-button">
                    Cancel
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

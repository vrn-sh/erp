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
            .patch(`${url}/${Cookies.get('Id')}`, {auth : {"fist_name" : userInfos.first_name, "last_name" : userInfos.last_name}}, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then(() => { setMessage('Updated !', 'success');  getUserInfos();})
            .catch((error) => {
                setMessage(error.message, 'error');
            });
    };

    return (
        <div className="container">
            <div style={{width : 'full'}}>
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
                <Stack direction={'row'} width='full' spacing={'space-between'}>
                <div className="input input-medium">
                    <label>username</label>
                    <input
                        id="input-username"
                        type="text"
                        readOnly
                        value={userInfos.username}
                        onChange={(e) => handleUsernameChange(e)}
                    />
                </div>
                <div className="input input-medium">
                    <label>email</label>
                    <input
                        id="input-email"
                        type="text"
                        readOnly
                        value={userInfos.email}
                    />
                </div>
                </Stack>
            </div>

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

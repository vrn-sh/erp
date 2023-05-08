import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import config from '../../../config';

export default function SettingAccount() {
    const [userInfos, setUserInfos] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
    });

    const token = Cookies.get('token');
    const role = Cookies.get('role');

    const getUserInfos = async () => {
        let url = `${config.apiUrl}/`;
        if (role === 'manager') url += 'manager';
        else url += 'user';
        await axios
            .get(`${config.apiUrl}/`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => setUserInfos(data.data))
            .catch((e) => {
                throw e;
            });
    };

    useEffect(() => {
        getUserInfos();
    }, []);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        userInfos.email = e.target.value;
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        userInfos.username = e.target.value;
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        userInfos.first_name = e.target.value;
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        userInfos.last_name = e.target.value;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let url = `${config.apiUrl}/`;
        if (role === 'manager') url += 'manager';
        else url += 'user';
        await axios
            .put(`${config.apiUrl}/`, userInfos, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${token}`,
                },
            })
            .then((data) => setUserInfos(data.data))
            .catch((error) => {
                throw error;
            });
    };

    return (
        <div className="setting-container">
            <div className="input-group">
                <div className="input input-medium">
                    <label htmlFor="input-username">username</label>
                    <input
                        id="input-username"
                        type="text"
                        value={userInfos.username}
                        onChange={(e) => handleUsernameChange(e)}
                    />
                </div>

                <div className="input input-medium">
                    <label htmlFor="input-email">email</label>
                    <input
                        id="input-email"
                        type="text"
                        value={userInfos.email}
                        onChange={(e) => handleEmailChange(e)}
                    />
                </div>

                <div className="input input-medium">
                    <label htmlFor="input-first_name">first_name</label>
                    <input
                        id="input-first_name"
                        type="text"
                        value={userInfos.first_name}
                        onChange={(e) => handleFirstNameChange(e)}
                    />
                </div>

                <div className="input input-medium">
                    <label htmlFor="input-last_name">last_name</label>
                    <input
                        id="input-last_name"
                        type="text"
                        value={userInfos.last_name}
                        onChange={(e) => handleLastNameChange(e)}
                    />
                </div>
            </div>

            <div className="buttons-container">
                <button
                    type="submit"
                    className="submit-button"
                    onSubmit={handleSubmit}
                >
                    Save Changes
                </button>
                <button type="button" className="cancel-button">
                    Cancel
                </button>
            </div>
        </div>
    );
}

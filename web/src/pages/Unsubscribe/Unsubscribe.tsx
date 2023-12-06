import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import * as MdIcons from 'react-icons/md';
import config from '../../config';
import './Unsubscribe.scss';
import logo from '../../assets/voron-logo.svg';

export default function UnsubscribeEmail() {
    const [query, setQuery] = useSearchParams();
    const token = query.get('token');
    const [confirmed, setConfirmed] = useState(false);
    const user = localStorage.getItem('user_info');
    const pwd = user !== null ? JSON.parse(user).password : '';

    const confirmFun = async () => {
        await axios
            .post(`${config.apiUrl}/confirm?token=${token}`, {
                password: pwd,
            })
            .then(() => {
                setConfirmed(true);
            })
            .catch((error) => {
                throw error;
            });
    };

    return (
        <div className="container unsubscribe">
            <div className="row">
                <div className="col-md-12">
                    <img src={logo} alt="" className="unsubscribe-logo" />
                    <h4>
                        You've successfully been unsubscribed from Voron's
                        newsletter.
                    </h4>
                    {/* <p>Didn't mean to unsubscribe?</p>
                        <form
                            action="/lists/encryptedResubscribe?token=..."
                            className="form-horizontal"
                            method="POST"
                        >
                            <input
                                type="hidden"
                                name="signature"
                                value="..."
                            />
                            <button className="btn btn-success btn-lg" type="submit">
                                <i className="fa fa-plus"></i> Resubscribe
                            </button>
                        </form> */}
                </div>
            </div>
        </div>
    );
}

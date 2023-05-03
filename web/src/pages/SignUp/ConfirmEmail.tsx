import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import * as MdIcons from 'react-icons/md';
import './SignUp.scss';
import config from "./../../config";

export default function ConfirmEmail() {
    const [query, setQuery] = useSearchParams();
    const token = query.get('token');
    const [confirmed, setConfirmed] = useState(false);
    const pwd = localStorage.getItem('pwd');

    const confirmFun = async() => {
        try {
            await axios
                .post(`${config.apiUrl}/confirm?token=${token}`, {
                    password: pwd
                })
                .then(() => {
                    setConfirmed(true);
                    console.log("ICI");
                })
                .catch((e) => {console.log(e)})
        } catch (e) {
            console.log(e)
        }
    }
    
    return (
        <section className="signup-container">
            <div className="signup-text" id="signup-text">
                <div>
                    <h2>voron</h2>
                    <h1>In efficiency we trust</h1>
                    <p>{token}</p>
                </div>
            </div>

            <div className="signup-form" id="signup-form">
                <div className="wrapper-log">
                    <MdIcons.MdMarkEmailRead style={{ fontSize: '3rem' }} />
                    {
                        confirmed 
                        ? <>
                            <h1>Thanks to confirm the email, sign up succeed!</h1>
                            <h5>
                                <a href="/login">Click here to log in please.</a>
                            </h5>
                        </>
                        : 
                        <>
                            <h1>Please click to confirm</h1>
                            <button
                                type='button'
                                style={{minWidth:"10px"}}
                                onClick={confirmFun}
                            >Confirm</button>
                        </>
                    }
                </div>
            </div>
        </section>
    );
}

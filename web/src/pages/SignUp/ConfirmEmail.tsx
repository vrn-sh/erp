import React from 'react';
import * as MdIcons from 'react-icons/md';
import './SignUp.scss';

export default function ConfirmEmail() {
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
                    <MdIcons.MdMarkEmailRead style={{ fontSize: '3rem' }} />
                    <h1>Thanks to confirm the email, sign up succeed!</h1>
                    <h5>
                        <a href="/login">Click here to log in please.</a>
                    </h5>
                </div>
            </div>
        </section>
    );
}

import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';

export default function Reset() {
    const [resetPassword, setResetPassword] = useState('');
    const [resetFeedback, setResetFeedback] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    console.log(token);
    const handlePasswordReset = async () => {
        try {
            const response = await axios.post(`${config.apiUrl}reset?token=${token}`, { password: resetPassword });
            setResetFeedback(response.data.message);
            setIsSuccess(true);
        } catch (error) {
            setResetFeedback('Error sending reset instructions. Please try again.');
            setIsSuccess(false);
        }
    };

    const toggleResetModal = () => {

    };

    return (
        <>
            <h2>Reset Password</h2>
            <p>Please enter your new password.</p>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <input
                    style={{margin: '10px'}}
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="Enter your new password"
                />
                <div style={{width: '300px'}}>
                    <button onClick={handlePasswordReset}>Reset password</button>
                    <p style={{display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center', color: isSuccess ? 'green' : 'red'}}>{resetFeedback}</p>
                    <button onClick={toggleResetModal}>Close</button>                                        
                </div>                                        
            </div>
        </>
    );
}
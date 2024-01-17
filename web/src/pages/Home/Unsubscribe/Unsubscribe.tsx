import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import config from '../../../config';
import './Unsubscribe.scss';
import logo from '../../../assets/voron-logo.svg';

export default function UnsubscribeEmail() {
    const [query] = useSearchParams();
    const email = query.get('email');
    const [unsubscribed, setUnsubscribed] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (email) {
            unsubscribeEmail();
        } else {
            setError('Error trying to unsubscribe, try again later');
        }
    }, [email]);

    const unsubscribeEmail = async () => {
        try {
            await axios.post(`${config.apiUrl}/mailing-list/unsubscribe`, { email });
            setUnsubscribed(true);
        } catch (err) {
            setError('Error unsubscribing. Please try again.');
        }
    };

    return (
        <div className="container unsubscribe">
            <div className="row">
                <div className="col-md-12">
                    <img src={logo} alt="" className="unsubscribe-logo" />
                    {unsubscribed ? (
                        <h4>You've successfully been unsubscribed from Voron's newsletter.</h4>
                    ) : (
                        <h4>{error || 'Unsubscribing...'}</h4>
                    )}
                </div>
            </div>
        </div>
    );
}

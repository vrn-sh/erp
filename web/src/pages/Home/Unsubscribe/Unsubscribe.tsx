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

    const unsubscribeEmail = async () => {
        await axios
            .post(`${config.apiUrl}/mailing-list/unsubscribe`, {
                email,
            })
            .then(() => {
                setUnsubscribed(true);
            })
            .catch((e) => {
                setError('Error unsubscribing. Please try again.');
                throw e;
            });
    };

    useEffect(() => {
        if (email) {
            unsubscribeEmail();
        } else {
            setError('Error trying to unsubscribe, try again later');
        }
    }, [email]);

    return (
        <div className="container unsubscribe">
            <div className="row">
                <div className="col-md-12">
                    <img src={logo} alt="" className="unsubscribe-logo" />
                    {unsubscribed ? (
                        <h4>
                            You've successfully been unsubscribed from Voron's
                            newsletter.
                        </h4>
                    ) : (
                        <h4>{error || 'Unsubscribing...'}</h4>
                    )}
                </div>
            </div>
        </div>
    );
}

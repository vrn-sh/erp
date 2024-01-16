import React, { useState } from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import '../../pages/Login/Login.scss';

function CustomLink({
    to,
    children,
    ...props
}: {
    to: string;
    children: string;
}) {
    return (
        <li>
            <a href={to} {...props}>
                {children}
            </a>
        </li>
    );
}

export default function Footer() {
    const [mailInput, setMailInput] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState<
        'success' | 'failure' | ''
    >('');

    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!isValidEmail(mailInput)) {
            alert('Please enter a valid email address');
            return;
        }
        await axios
            .post(`${config.apiUrl}/mailing-list`, {
                email: mailInput,
            })
            .then((data) => {
                setSubscriptionStatus('success');
            })
            .catch((error) => {
                setSubscriptionStatus('failure');
                throw error;
            });
    };

    return (
        <div className="footer">
            <div className="footer-info">
                <Link to="/#home" className="site-title">
                    voron
                </Link>
                <p style={{ marginTop: '1rem' }}>Copyright ©2023 VORON, Inc.</p>
                <p>Contact voron@djnn.sh</p>
                <div className="policy-link">
                    <ul>
                        <CustomLink to="/termofuse">Term of use</CustomLink>
                        <CustomLink to="/privacypolicy">
                            Privacy Policy
                        </CustomLink>
                    </ul>
                </div>
            </div>
            <div className="footer-newsletter">
                <h3>Newsletter</h3>
                <p>
                    Subscribe to our newsletter to get news, tips, updates, and
                    more information about us
                </p>
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e) => setMailInput(e.target.value)}
                    placeholder="Enter your email"
                />
                <button onClick={handleSubmit} type="button">
                    Subscribe
                </button>
                {subscriptionStatus === 'success' && (
                    <span style={{ color: 'green', marginLeft: '1rem' }}>
                        Subscription successful!
                    </span>
                )}
                {subscriptionStatus === 'failure' && (
                    <span style={{ color: 'red', marginLeft: '1rem' }}>
                        Subscription failed. Please try again.
                    </span>
                )}
            </div>
        </div>
    );
}

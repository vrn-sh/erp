import React, { useState } from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/voron-logo.svg';
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
        try {
            const response = await axios.post(
                `http://localhost:8000/mailing-list`,
                {
                    email: mailInput,
                }
            );
            console.log('Mailing List Response:', response);
        } catch (error) {
            console.error('Error:', error);
        }
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
                    Subscribe our newsletter to get news, tips, updates and more
                    information about us
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
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';
import logo from '../../assets/voron-logo.svg';
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
    const [mailInput, setMailInput] = useState("");
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
                `${config.apiUrl}/mailing-list`,
                { email: mailInput }
            );
            console.log('Mailing List Response:', response);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className="footer">
            <img
                src={logo}
                alt="logo"
                style={{ width: '2rem', height: '2rem' }}
            />
            <Link to="/#home" className="site-title">
                voron
            </Link>
            <p>Copyright ©2023 VORON, Inc.</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                    style={{ margin: '10px' }}
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e) => setMailInput(e.target.value)}
                    placeholder="Enter your email"
                />
                <button onClick={handleSubmit} type="button" style={{ width: '3em' }}>
                    Subscribe to our newsletter
            </button>
            </div>
            <p>Contact voron@djnn.sh</p>
            <div className="policy-link">
                <ul>
                    <CustomLink to="/termofuse">Term of use</CustomLink>
                    <CustomLink to="/privacypolicy">Privacy Policy</CustomLink>
                </ul>
            </div>
        </div>
    );
}

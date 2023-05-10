import React from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';
import logo from '../../assets/voron-logo.svg';

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

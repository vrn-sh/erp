import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.scss';

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
export default function NavBar() {
    return (
        <nav className="nav">
            <Link to="#home" className="site-title">
                voron
            </Link>
            <ul>
                <div className="nav-left">
                    <CustomLink to="#home">Home</CustomLink>
                    <CustomLink to="#about">About</CustomLink>
                    <CustomLink to="#team">Team</CustomLink>
                </div>
                <div className="nav-right">
                    <Link to="/signup">Sign up</Link>
                    <li className="login">
                        <Link to="/login">Log in</Link>
                    </li>
                </div>
            </ul>
        </nav>
    );
}

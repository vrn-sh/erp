import React from 'react';
import { Link } from 'react-router-dom';
import privacyText from '../../assets/strings/en/privacypo.json';
import './Text.scss';
import Footer from '../../component/Footer/Footer';

export default function PrivatePolicy() {
    return (
        <div className="onlytxt_container">
            <Link to="/" className="onlytxt_logo">
                voron
            </Link>
            <div className="onlytxt_content">
                {privacyText.privacypolicy.map((part) => {
                    return (
                        <>
                            <h1>{part.title}</h1>
                            <p>{part.content}</p>
                        </>
                    );
                })}
            </div>
            <Footer />
        </div>
    );
}

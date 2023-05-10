import React from 'react';
import { Link } from 'react-router-dom';
import './Text.scss';
import Footer from '../../component/Footer/Footer';
import term from '../../assets/strings/en/termofuse.json';

export default function TermOfUse() {
    return (
        <div className="onlytxt_container">
            <Link to="/" className="onlytxt_logo">
                voron
            </Link>
            <div className="onlytxt_content">
                {term.termofuse.map((t) => {
                    return (
                        <>
                            <h1>{t.title}</h1>
                            <p>{t.content}</p>
                        </>
                    );
                })}
            </div>
            <Footer />
        </div>
    );
}

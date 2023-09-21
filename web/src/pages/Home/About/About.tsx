import React from 'react';
import './About.scss';
import { Link } from 'react-router-dom';
import strings from '../../../assets/strings/en/about.json';

export default function About() {
    return (
        <div id="about" className="about">
            <div className="about-main-row">
            <div className="about-more">
                {strings.more.map((item) => (
                    <div>
                        <h1 className='title'>{item.title}</h1>
                        <p>{item.desc}</p>
                    </div>
                ))}
                <Link to="/sign_up" className="about-catch">
                    <h1>{strings.catch}</h1>
                    <button type="button">{strings.catchCTA}</button>
                </Link>
            </div>
            </div>


        </div>
    );
}

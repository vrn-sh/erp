import React from 'react';
import './About.scss';
import { Link } from 'react-router-dom';
import strings from '../../../assets/strings/en/about.json';

export default function About() {
    return (
        <div id="about" className="about">
            <div className="about-main-row">
                <Link to="/sign_up" className="about-catch">
                    <h1>{strings.catch}</h1>
                    <button type="button">{strings.catchCTA}</button>
                </Link>
                <div className="about-bullets">
                    <p>{strings.catchHighlight}</p>
                    <ul>
                        {strings.bullets.map((bullet) => (
                            <li>{bullet}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="about-more">
                {strings.more.map((item) => (
                    <div>
                        <h2>{item.title}</h2>
                        <p>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

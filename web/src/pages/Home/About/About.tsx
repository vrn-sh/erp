import React from 'react';
import './About.scss';
import { Link } from 'react-router-dom';
import strings from '../../../assets/strings/en/about.json';
import action from '../../../assets/about-action.svg';

export default function About() {
    return (
        <div id="about" className="about">
            <div className="about-main-row">
                <div className="about-more">
                    {strings.more.map((item, index) =>
                        item.position === 'right' ? (
                            <div key={index} style={{ textAlign: 'right' }}>
                                <h1 className="title">{item.title}</h1>
                                <p style={{ textAlign: 'right' }}>
                                    {item.desc}
                                </p>
                            </div>
                        ) : (
                            <div key={index} style={{ textAlign: 'left' }}>
                                <h1 className="title">{item.title}</h1>
                                <p style={{ textAlign: 'left' }}>{item.desc}</p>
                            </div>
                        )
                    )}
                    <Link to="/sign_up">
                        <img
                            src={action}
                            alt="about-action"
                            className="about-action"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}

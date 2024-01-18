import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as MdIcons from 'react-icons/md';
import { Chip } from '@mui/material';
import Feedbacks from '../../../component/Feedback';
import config from '../../../config';
import { getCookiePart } from '../../../crypto-utils';

export interface IEmailF {
    first_name: string;
    last_name: string;
    email: string;
    score: number;
    domain: string;
    accept_all: boolean;
    position: string | null;
    twitter: string | null;
    linkedin_url: string | null;
    phone_number: string | null;
    company: string;
    sources: [];
    verification: {
        date: string | null;
        status: string;
    };
}

export default function HunterEmailF() {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [getRes, setGetRes] = useState(false);
    const [score, setScore] = useState('');
    const [hunterEmailF, setHunterEmailF] = useState<IEmailF>({
        first_name: '',
        last_name: '',
        email: '',
        score: 0,
        domain: '.',
        accept_all: false,
        position: null,
        twitter: null,
        linkedin_url: null,
        phone_number: null,
        company: '',
        sources: [],
        verification: {
            date: null,
            status: '',
        },
    });

    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [open, setOpen] = useState(false);

    const close = () => {
        setOpen(false);
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const emailFinder = async () => {
        setOpen(true);
        const splitted = name.split(' ', 2);
        await axios
            .get(
                `${config.apiUrl}/hunt?domain=${company}&first_name=${splitted[0]}&last_name=${splitted[1]}`,
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
                    },
                }
            )
            .then((data) => {
                setMessage('Searching...', 'success');
                setGetRes(true);
                setHunterEmailF(data.data.data);
            })
            .catch((e) => {
                setMessage('Failed...', 'error');
                throw e.message;
            });
    };

    useEffect(() => {
        const tmp = hunterEmailF.score.toString().concat('%');
        setScore(tmp);
    }, [hunterEmailF]);

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                emailFinder();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [company, name]);

    return (
        <div className="hunter-scroll-div">
            <div className="hunter-input-bar">
                <h4>Email Finder</h4>
                <input
                    className="hunter-finder-name-input"
                    placeholder="Enter a full name"
                    type="text"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                />
                <span>@</span>
                <input
                    className="hunter-finder-company-input"
                    placeholder="Company.com"
                    type="text"
                    name="company"
                    onChange={(e) => setCompany(e.target.value)}
                />
                <button
                    type="button"
                    className="searchBtn"
                    onClick={emailFinder}
                >
                    Search
                </button>
            </div>
            {!getRes === true ? (
                <h3
                    style={{
                        fontFamily: 'Poppins-Regular',
                    }}
                    className="centered"
                >
                    Nothing to show
                </h3>
            ) : (
                <div className="emailf-res-container">
                    {hunterEmailF.score > 80 ? (
                        <Chip
                            avatar={
                                <MdIcons.MdOutlineSecurity
                                    style={{
                                        color: '#11681A',
                                        marginRight: '.5rem',
                                    }}
                                />
                            }
                            color="success"
                            label={score}
                            variant="outlined"
                        />
                    ) : (
                        <Chip
                            avatar={
                                <MdIcons.MdOutlineSecurity
                                    style={{
                                        color: '#DD742D',
                                        marginRight: '.5rem',
                                    }}
                                />
                            }
                            color="warning"
                            label={score}
                            variant="outlined"
                        />
                    )}

                    <div className="emailf-email-info">
                        <p>
                            {hunterEmailF.first_name} {hunterEmailF.last_name}
                        </p>
                        <span>{hunterEmailF.email}</span>
                        <span>Company: {hunterEmailF.company}</span>
                    </div>
                </div>
            )}
            {open && (
                <Feedbacks
                    mess={message.mess}
                    close={close}
                    color={message.color}
                    open={open}
                />
            )}
        </div>
    );
}

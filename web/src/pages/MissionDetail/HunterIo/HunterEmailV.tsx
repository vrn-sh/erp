import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as MdIcons from 'react-icons/md';
import { Chip } from '@mui/material';
import Feedbacks from '../../../component/Feedback';
import config from '../../../config';
import { getCookiePart } from '../../../crypto-utils';

export interface IEmailV {
    status: string;
    result: string;
    _deprecation_notice: string;
    score: number;
    email: string;
    regexp: boolean;
    gibberish: boolean;
    disposable: boolean;
    webmail: boolean;
    mx_records: boolean;
    smtp_server: boolean;
    smtp_check: boolean;
    accept_all: boolean;
    block: boolean;
    sources: [];
}

export default function HunterEmailV() {
    const [email, setEmail] = useState('');
    const [getRes, setGetRes] = useState(false);
    const [hunterEmailV, setHunterEmailV] = useState<IEmailV>({
        status: '',
        result: '',
        _deprecation_notice: '',
        score: 0,
        email: '',
        regexp: false,
        gibberish: false,
        disposable: false,
        webmail: false,
        mx_records: false,
        smtp_server: false,
        smtp_check: false,
        accept_all: false,
        block: false,
        sources: [],
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

    const emailVerify = async () => {
        setOpen(true);
        await axios
            .get(`${config.apiUrl}/hunt?email=${email}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                setMessage('Searching...', 'success');
                setGetRes(true);
                setHunterEmailV(data.data.data);
            })
            .catch((e) => {
                setMessage('Failed...', 'error');
                throw e.message;
            });
    };

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                emailVerify();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [email]);

    return (
        <div className="hunter-scroll-div">
            <div className="hunter-input-bar">
                <h4>Email Verify</h4>
                <input
                    className="hunter-form-control"
                    placeholder="Enter an email address"
                    type="text"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    type="button"
                    className="searchBtn"
                    onClick={emailVerify}
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
                <>
                    <div className="emailv-intro-txt">
                        <MdIcons.MdOutlineSecurity
                            style={{ color: '#7C44F3', marginRight: '1rem' }}
                        />
                        {hunterEmailV.accept_all === true ? (
                            <p>
                                The domain '{hunterEmailV.email}' accepts all
                                the emails addresses. Confidence score:{' '}
                                {hunterEmailV.score}%
                            </p>
                        ) : (
                            <p>
                                The domain '{hunterEmailV.email}' doesn't accept
                                all the emails addresses. Confidence score:{' '}
                                {hunterEmailV.score}%
                            </p>
                        )}
                    </div>
                    <div className="emailv-detail-info">
                        <div className="emailv-detail-part">
                            <div className="emailv-detail-height">
                                <div className="emailv-detail-title">
                                    <p>Format</p>
                                    {hunterEmailV.gibberish === true ? (
                                        <Chip
                                            color="warning"
                                            label="Gibberish"
                                            size="small"
                                        />
                                    ) : (
                                        <Chip
                                            color="success"
                                            label="Non Gibberish"
                                            size="small"
                                        />
                                    )}
                                </div>
                                <p>
                                    This email address seems{' '}
                                    {hunterEmailV.gibberish === true ? (
                                        <span>to be </span>
                                    ) : (
                                        <span>isn't </span>
                                    )}
                                    gibberish
                                </p>
                            </div>

                            <div className="emailv-detail-height">
                                <div className="emailv-detail-title">
                                    <p>Server status</p>
                                    {hunterEmailV.mx_records === true ? (
                                        <Chip
                                            color="success"
                                            label="Valid"
                                            size="small"
                                        />
                                    ) : (
                                        <Chip
                                            color="warning"
                                            label="Invalid"
                                            size="small"
                                        />
                                    )}
                                </div>
                                {hunterEmailV.mx_records === true ? (
                                    <p>
                                        MX records are present for the domain.
                                        <br />
                                        {hunterEmailV.smtp_server === true ? (
                                            <span>
                                                {' '}
                                                We can connect to the SMTP
                                                server these MX records point
                                                to.
                                            </span>
                                        ) : (
                                            <span>
                                                {' '}
                                                We can not connect to the SMTP
                                                server these MX records point
                                                to.
                                            </span>
                                        )}
                                    </p>
                                ) : (
                                    <p>
                                        MX records are not present for the
                                        domain.{' '}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="emailv-detail-part">
                            <div className="emailv-detail-height">
                                <div className="emailv-detail-title">
                                    <p>Type</p>
                                    {hunterEmailV.mx_records === true ? (
                                        <Chip
                                            color="success"
                                            label="Professional"
                                            size="small"
                                        />
                                    ) : (
                                        <Chip
                                            color="warning"
                                            label="Webmail"
                                            size="small"
                                        />
                                    )}
                                </div>
                                {hunterEmailV.webmail === true ? (
                                    <p>The domain name is used for webmails.</p>
                                ) : (
                                    <p>
                                        The domain name isn't used for webmails
                                        or for creating temporary email
                                        addresses.{' '}
                                    </p>
                                )}
                            </div>

                            <div className="emailv-detail-height">
                                <div className="emailv-detail-title">
                                    <p>Email status</p>
                                    {hunterEmailV.accept_all === true ? (
                                        <Chip
                                            color="warning"
                                            label="Accept all"
                                            size="small"
                                        />
                                    ) : (
                                        <Chip
                                            color="success"
                                            label="Valid"
                                            size="small"
                                        />
                                    )}
                                </div>
                                {hunterEmailV.mx_records === true ? (
                                    <p>
                                        This email address is linked to an
                                        accept=all domain. There is no
                                        definitive way to determine whether this
                                        mail is valid or invalid.
                                    </p>
                                ) : (
                                    <p>
                                        This email address is not linked to an
                                        accept-all domain.{' '}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
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

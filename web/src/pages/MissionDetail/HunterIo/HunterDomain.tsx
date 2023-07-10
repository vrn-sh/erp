import React, { useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
} from '@mui/material';
import './Hunter.scss';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';
import HunterData from '../../../assets/strings/en/domain.json';

export interface IRecon {
    domain: string;
    disposable: boolean;
    webmail: boolean;
    accept_all: boolean;
    pattern: string;
    organization: string;
    description: string | null;
    twitter: string | null;
    facebook: string | null;
    linkedin: string | null;
    instagram: string | null;
    youtube: string | null;
    technologies: [];
    country: string | null;
    state: string | null;
    city: string | null;
    postal_code: string | null;
    street: string | null;
    email: {
        value: string;
        type: string;
        confidence: number;
        souces: {
            domain: string;
            uri: string;
            extracted_on: string;
            last_seen_on: string;
            still_on_page: boolean;
        }[];
        first_name: string;
        last_name: string;
        position: string | null;
        seniority: string | null;
        department: string | null;
        linkedin: string | null;
        twitter: string | null;
        phone_number: string | null;
        verification: {
            date: string | null;
            status: string | null;
        };
    }[];
    meta: {
        results: number;
        limit: number;
        offset: number;
        params: {
            domain: string;
            company: string | null;
            type: string | null;
            seniority: string | null;
            department: string | null;
        };
    };
}

export default function HunterDomain() {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const recordsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = HunterData!.data.emails.slice(firstIndex, lastIndex);
    const npage = Math.ceil(HunterData!.data.emails.length / recordsPerPage);
    const nums = [...Array(npage + 1).keys()].slice(1);

    const handleChange =
        (panel: string) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };
    const nextPage = () => {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prePage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const changePage = (n: number) => {
        setCurrentPage(n);
    };

    return (
        <div className="hunter-scroll-div">
            <div className="hunter-input-bar">
                <h4>Domain Search</h4>
                <input
                    className="hunter-form-control"
                    placeholder="Enter an domain name"
                    type="text"
                    name="domain"
                />

                <button type="button" className="searchBtn">
                    Search
                </button>
            </div>
            {!HunterData.data ? (
                <h3 style={{ fontFamily: 'Poppins-Regular' }}>
                    Nothing to show
                </h3>
            ) : (
                <table className="no_center_container">
                    <tbody>
                        <Accordion>
                            <AccordionSummary
                                aria-controls="panel3a-content"
                                id="panel3a-header"
                                expandIcon={<IoIcons.IoIosArrowDown />}
                            >
                                <p style={{ margin: 0, padding: 0 }}>
                                    Company information
                                </p>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p className="hunter-company-p">
                                    Organisation:
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: 'black',
                                                marginLeft: '.5rem',
                                            }}
                                        >
                                            {HunterData.data.organization}
                                        </span>
                                        <a
                                            href={HunterData.data.facebook}
                                            style={{
                                                marginRight: '.5rem',
                                                marginLeft: '.5rem',
                                            }}
                                        >
                                            <BsIcons.BsFacebook size={16} />
                                        </a>
                                        <a
                                            href={HunterData.data.twitter}
                                            style={{ marginRight: '.5rem' }}
                                        >
                                            <BsIcons.BsTwitter size={16} />
                                        </a>
                                        <a
                                            href={HunterData.data.linkedin}
                                            style={{ marginRight: '.5rem' }}
                                        >
                                            <BsIcons.BsLinkedin size={16} />
                                        </a>
                                        <a href={HunterData.data.instagram}>
                                            <BsIcons.BsInstagram size={16} />
                                        </a>
                                    </div>
                                </p>
                                <div className="hunter-company-subinfo">
                                    <p>
                                        Pattern:{' '}
                                        <span
                                            style={{
                                                color: 'black',
                                                marginLeft: '.5rem',
                                            }}
                                        >
                                            {HunterData.data.pattern}@
                                            {HunterData.data.domain}
                                        </span>
                                    </p>
                                    <p
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        Accept all:
                                        {HunterData.data.accept_all === true ? (
                                            <AiIcons.AiOutlineCheck
                                                color="green"
                                                size={20}
                                            />
                                        ) : (
                                            <AiIcons.AiOutlineClose
                                                color="red"
                                                size={20}
                                            />
                                        )}
                                    </p>
                                    <p
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        Webmail:
                                        {HunterData.data.webmail === true ? (
                                            <AiIcons.AiOutlineCheck
                                                color="green"
                                                size={20}
                                            />
                                        ) : (
                                            <AiIcons.AiOutlineClose
                                                color="red"
                                                size={20}
                                            />
                                        )}
                                    </p>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        {records.map((res, index) => {
                            return (
                                <Accordion
                                    expanded={expanded === `panel${index}`}
                                    onChange={handleChange(`panel${index}`)}
                                >
                                    <AccordionSummary
                                        expandIcon={<IoIcons.IoIosArrowDown />}
                                        aria-controls="panel1bh-content"
                                        sx={{
                                            backgroundColor:
                                                'rgba(0, 0, 0, .02)',
                                        }}
                                        id="panel1bh-header"
                                    >
                                        <div className="hunter-list-summary">
                                            <p style={{ width: '40%' }}>
                                                {res.first_name} {res.last_name}
                                            </p>
                                            <div
                                                style={{
                                                    width: '20%',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <MdIcons.MdOutlineSecurity
                                                    style={{ color: '#7C44F3' }}
                                                />
                                                <p> {res.confidence}%</p>
                                            </div>
                                            <p
                                                style={{
                                                    width: '30%',
                                                    textAlign: 'end',
                                                }}
                                            >
                                                {res.sources.length} sources
                                            </p>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {res.sources.length === 0 ? (
                                            <h3
                                                style={{
                                                    fontFamily:
                                                        'Poppins-Regular',
                                                }}
                                                className="centered"
                                            >
                                                Nothing to show
                                            </h3>
                                        ) : (
                                            <>
                                                {res.sources.map((r) => {
                                                    return (
                                                        <div className="domain-detail-container">
                                                            <div className="domain-detail">
                                                                <p>
                                                                    <a
                                                                        href={
                                                                            r.uri
                                                                        }
                                                                        className="domain-uri"
                                                                    >
                                                                        {
                                                                            r.domain
                                                                        }
                                                                    </a>
                                                                </p>
                                                                <p>
                                                                    {r.still_on_page ===
                                                                    true ? (
                                                                        <Chip
                                                                            color="success"
                                                                            label="Still online"
                                                                        />
                                                                    ) : (
                                                                        <Chip
                                                                            color="warning"
                                                                            label="Offline"
                                                                        />
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="domain-detail">
                                                                <p>
                                                                    extracted
                                                                    on:{' '}
                                                                    {
                                                                        r.extracted_on
                                                                    }
                                                                </p>
                                                                <p>
                                                                    last seen
                                                                    on:{' '}
                                                                    {
                                                                        r.last_seen_on
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <nav>
                <ul className="pagination">
                    <li className="page-item">
                        <a href="#" className="page-link" onClick={prePage}>
                            <IoIcons.IoIosArrowBack />
                        </a>
                    </li>
                    {nums.map((n) => {
                        return (
                            <li
                                key={n}
                                className={`page-item ${
                                    currentPage === n ? 'active' : ''
                                }`}
                            >
                                <a
                                    href="#"
                                    className="page-link"
                                    onClick={() => changePage(n)}
                                >
                                    {n}
                                </a>
                            </li>
                        );
                    })}
                    <li className="page-item">
                        <a href="#" className="page-link" onClick={nextPage}>
                            <IoIcons.IoIosArrowForward />
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

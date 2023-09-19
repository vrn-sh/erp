import React, { useEffect, useState } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import './Recon.scss';
import * as IoIcons from 'react-icons/io';
import * as AiIcons from 'react-icons/ai';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Stack,
    Tooltip,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../../config';
import AddNMAP from './AddNMAP';
import Feedbacks from '../../component/Feedback';

export interface IRecon {
    id: number;
    updated_at: string;
    nmap_runs: {
        id: number;
        ips: string[];
        ports: string[];
        creation_timestamp: string;
        recon: number;
    }[];
}

export interface ITech {
    tech: {
        name: string[];
        category: string;
    }[];
}

export interface IWapp {
    url: string;
    description: string;
    technologies: {
        slug: string;
        name: string;
        versions: string[];
        trafficRank: number;
        confirmedAt: number;
        categories: {
            id: number;
            slug: string;
            name: string;
        }[];
    }[];
    ipCountry: string;
    language: string;
    responsive: boolean;
    'certInfo.protocol': string;
    'certInfo.validTo': number;
    'certInfo.issuer': string;
    'dns.spf': boolean;
    'dns.dmarc': boolean;
    https: boolean;
    createdAt: number;
    updatedAt: number;
    languages: string[];
}

export default function Recon(idMission: any) {
    const [recon, setRecon] = useState<IRecon>({
        id: 0,
        updated_at: '2023-05-08T14:29:15.580559Z',
        nmap_runs: [],
    });
    const [wappDomain, setWappDomain] = useState('');
    const [wappaOk, setWappaOk] = useState(false);
    const [wappRes, setWappRes] = useState<IWapp>({
        url: '',
        technologies: [],
        description: '',
        ipCountry: '',
        language: '',
        responsive: false,
        'certInfo.protocol': '',
        'certInfo.validTo': 0,
        'certInfo.issuer': '',
        'dns.spf': false,
        'dns.dmarc': false,
        https: false,
        createdAt: 0,
        updatedAt: 0,
        languages: [],
    });
    const [tech, setTech] = useState<ITech>({
        tech: [],
    });
    const recordsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = recon!.nmap_runs.slice(firstIndex, lastIndex);
    const npage = Math.ceil(recon!.nmap_runs.length / recordsPerPage);
    const nums = [...Array(npage + 1).keys()].slice(1);
    const [modal, setModal] = useState(false);
    const { id } = idMission;
    const isPentester = Cookies.get('Role') === '1';
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [open, setOpen] = useState(false);

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

    const findCategory = (c: any, search: string) => {
        for (let i = 0; i < c.length; i += 1) {
            if (c[i].category === search) return i;
        }
        return -1;
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const getTech = (w: any) => {
        const tab = [];
        for (let i = 0; i < w.technologies.length; i += 1) {
            const tmp = w.technologies[i];
            for (let j = 0; j < tmp.categories.length; j += 1) {
                const checked = findCategory(tab, tmp.categories[j].name);
                if (checked > 0) {
                    tab[checked].name.push(tmp.name);
                } else
                    tab.push({
                        name: [tmp.name],
                        category: tmp.categories[j].name,
                    });
            }
        }
        tech.tech = tab;
        setTech(tech);
    };

    const close = () => {
        setOpen(false);
    };

    const getWappa = async () => {
        setWappaOk(false);
        setOpen(true);
        await axios(`${config.apiUrl}/wappa?urls=${wappDomain}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${Cookies.get('Token')}`,
            },
            maxBodyLength: Infinity,
        })
            .then((data) => {
                setWappaOk(true);
                setMessage('Succeed to search!', 'success');
                setWappRes(data.data[0]);
                getTech(data.data[0]);
            })
            .catch((e) => {
                setWappaOk(false);
                setMessage('Please enter a correct url!', 'error');
                throw e;
            });
    };

    const getMission = async () => {
        await axios
            .get(`${config.apiUrl}/mission/${id}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                setRecon(data.data.recon);
            })
            .catch((e) => {
                throw e;
            });
    };

    const modalClick = () => {
        if (modal) getMission();
        setModal(!modal);
    };

    useEffect(() => {
        getMission();
    }, []);

    useEffect(() => {
        getTech(wappRes);
    }, [wappRes]);

    return (
        <>
            {modal && <AddNMAP func={modalClick} idRecon={recon.id} />}
            <div className="recon_container">
                <div className="recon_info">
                    <div className="mission-tool-line">
                        {isPentester && (
                            <button
                                type="button"
                                className="input_btn mission-borderBtn"
                                onClick={modalClick}
                            >
                                ADD NMAP
                            </button>
                        )}
                    </div>
                    {!records.length ? (
                        <h3 style={{ fontFamily: 'Poppins-Regular' }}>
                            Nothing to show
                        </h3>
                    ) : (
                        <>
                            <table className="no_center_container">
                                <tbody>
                                    {records.map((s_list) => {
                                        return (
                                            <Accordion
                                                key={s_list.id}
                                                expanded={
                                                    expanded ===
                                                    `panel${s_list.id}`
                                                }
                                                onChange={handleChange(
                                                    `panel${s_list.id}`
                                                )}
                                            >
                                                <AccordionSummary
                                                    expandIcon={
                                                        <IoIcons.IoIosArrowDown />
                                                    }
                                                    aria-controls="panel1bh-content"
                                                    sx={{
                                                        backgroundColor:
                                                            'rgba(0, 0, 0, .02)',
                                                    }}
                                                    id="panel1bh-header"
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={15}
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                    >
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                            }}
                                                        >
                                                            {s_list.id}
                                                        </p>
                                                        <p>
                                                            {s_list.creation_timestamp.slice(
                                                                0,
                                                                10
                                                            )}
                                                        </p>
                                                        <p>
                                                            IPS :{' '}
                                                            {s_list.ips.length}
                                                        </p>
                                                        <p>
                                                            Ports :{' '}
                                                            {
                                                                s_list.ports
                                                                    .length
                                                            }
                                                        </p>
                                                    </Stack>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <p>Ports</p>
                                                    {!s_list!.ports.length ? (
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
                                                            {s_list!.ports.map(
                                                                (nmap) => {
                                                                    return (
                                                                        <Tooltip
                                                                            title="See more"
                                                                            arrow
                                                                        >
                                                                            <Chip
                                                                                sx={{
                                                                                    margin: '8px',
                                                                                }}
                                                                                label={
                                                                                    nmap
                                                                                }
                                                                            />
                                                                        </Tooltip>
                                                                    );
                                                                }
                                                            )}
                                                        </>
                                                    )}
                                                    <p>IPS</p>
                                                    {!s_list!.ips.length ? (
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
                                                            {s_list!.ips.map(
                                                                (nmap) => {
                                                                    return (
                                                                        <Tooltip
                                                                            title="See more"
                                                                            arrow
                                                                        >
                                                                            <Chip
                                                                                sx={{
                                                                                    margin: '8px',
                                                                                }}
                                                                                label={
                                                                                    nmap
                                                                                }
                                                                            />
                                                                        </Tooltip>
                                                                    );
                                                                }
                                                            )}
                                                        </>
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <nav>
                                <ul className="pagination">
                                    <li className="page-item">
                                        <a
                                            href="#"
                                            className="page-link"
                                            onClick={prePage}
                                        >
                                            <IoIcons.IoIosArrowBack />
                                        </a>
                                    </li>
                                    {nums.map((n) => {
                                        return (
                                            <li
                                                key={n}
                                                className={`page-item ${
                                                    currentPage === n
                                                        ? 'active'
                                                        : ''
                                                }`}
                                            >
                                                <a
                                                    href="#"
                                                    className="page-link"
                                                    onClick={() =>
                                                        changePage(n)
                                                    }
                                                >
                                                    {n}
                                                </a>
                                            </li>
                                        );
                                    })}
                                    <li className="page-item">
                                        <a
                                            href="#"
                                            className="page-link"
                                            onClick={nextPage}
                                        >
                                            <IoIcons.IoIosArrowForward />
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                </div>
                <div
                    className="recon_info"
                    style={{ justifyContent: 'center' }}
                >
                    <div className="wappa_input_container">
                        <input
                            placeholder="Enter a domain name"
                            onChange={(e) => setWappDomain(e.target.value)}
                            className="wappa_input"
                        />
                        <button
                            type="button"
                            className="searchBtn wappa_search"
                            onClick={() => {
                                getWappa();
                            }}
                        >
                            Search
                        </button>
                    </div>

                    {wappaOk ? (
                        <div className="wappa_res_container">
                            <div className="wappa_res_info">
                                <h4
                                    style={{
                                        textAlign: 'center',
                                        color: '#632add',
                                    }}
                                >
                                    {wappRes.url}
                                </h4>
                                {wappRes.description === undefined ? null : (
                                    <>
                                        <h5>Description</h5>
                                        <p>{wappRes.description}</p>
                                    </>
                                )}
                            </div>
                            <div className="wappa_res_info">
                                <h5>Security</h5>
                                <div className="wappa_row">
                                    <div className="md-5">
                                        <h6>Certificate protocol</h6>
                                        {wappRes['certInfo.protocol'] ===
                                        undefined ? (
                                            <p>-</p>
                                        ) : (
                                            <p>
                                                {wappRes['certInfo.protocol']}
                                            </p>
                                        )}

                                        <h6>Certificate expire</h6>
                                        {wappRes['certInfo.validTo'] ===
                                        undefined ? (
                                            <p>-</p>
                                        ) : (
                                            <p>{wappRes['certInfo.validTo']}</p>
                                        )}
                                    </div>
                                    <div className="md-5">
                                        <h6>SPF record</h6>
                                        {wappRes['dns.spf'] === true ? (
                                            <AiIcons.AiOutlineCheck
                                                style={{ color: 'green' }}
                                            />
                                        ) : (
                                            <AiIcons.AiOutlineClose
                                                style={{ color: 'red' }}
                                            />
                                        )}
                                        <h6>DMARC record</h6>
                                        {wappRes['dns.dmarc'] === true ? (
                                            <AiIcons.AiOutlineCheck
                                                style={{ color: 'green' }}
                                            />
                                        ) : (
                                            <AiIcons.AiOutlineClose
                                                style={{ color: 'red' }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="wappa_res_info">
                                <h5>Local</h5>
                                <h6>Ip country</h6>
                                <p>{wappRes.ipCountry}</p>
                                <h6>Languages</h6>
                                {wappaOk && wappRes
                                    ? wappRes.languages.map((langue, i) => {
                                          return (
                                              <p style={{ display: 'inline' }}>
                                                  {i ===
                                                  wappRes.languages.length - 1
                                                      ? `${langue}`
                                                      : `${langue}, `}
                                              </p>
                                          );
                                      })
                                    : null}
                            </div>

                            {tech.tech.length > 1 ? (
                                <div className="wappa_res_info">
                                    <h5>Technologie stacks</h5>
                                    {tech.tech.map((o) => {
                                        return (
                                            <>
                                                <h6>{o.category}</h6>
                                                {o.name.map((n, i) => {
                                                    return (
                                                        <p
                                                            style={{
                                                                display:
                                                                    'inline',
                                                            }}
                                                        >
                                                            {i ===
                                                            o.name.length - 1
                                                                ? `${n}`
                                                                : `${n}, `}
                                                        </p>
                                                    );
                                                })}
                                            </>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <h5 className="error_msg">Please enter a right url</h5>
                    )}
                </div>
            </div>
            {open && (
                <Feedbacks
                    mess={message.mess}
                    close={close}
                    color={message.color}
                    open={open}
                />
            )}
        </>
    );
}

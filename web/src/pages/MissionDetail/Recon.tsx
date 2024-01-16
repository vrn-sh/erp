import React, { useEffect, useState } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import './Recon.scss';
import * as IoIcons from 'react-icons/io';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Stack,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaPlus } from 'react-icons/fa6';
import config from '../../config';
import AddNMAP from './AddNMAP';
import Feedbacks from '../../component/Feedback';
import { getCookiePart } from '../../crypto-utils';

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

type ITech = {
    info: {
        slug: string;
        name: string;
        description: string;
        confidence: number;
        version: string | null;
        website: string;
        trafficRank: number;
        confirmedAt: number;
        categories: {
            id: number;
            slug: string;
        };
    }[];
    category: string;
}[];

type IWapp = {
    slug: string;
    name: string;
    description: string;
    confidence: number;
    version: string | null;
    website: string;
    trafficRank: number;
    confirmedAt: number;
    categories: {
        id: number;
        slug: string;
        name: string;
    }[];
}[];

export default function Recon(idMission: any) {
    const [recon, setRecon] = useState<IRecon>({
        id: 0,
        updated_at: '2023-05-08T14:29:15.580559Z',
        nmap_runs: [],
    });
    const [wappDomain, setWappDomain] = useState('');
    const [wappaOk, setWappaOk] = useState(false);
    const [wappRes, setWappRes] = useState<IWapp>([]);
    const [searching, setSearching] = useState(false);
    const [tech, setTech] = useState<ITech>([]);
    const recordsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = recon!.nmap_runs.slice(firstIndex, lastIndex);
    const npage = Math.ceil(recon!.nmap_runs.length / recordsPerPage);
    const nums = [...Array(npage + 1).keys()].slice(1);
    const [modal, setModal] = useState(false);
    const { id } = idMission;
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';
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
        for (let i = 0; i < w.length; i += 1) {
            const tmp = w[i];
            for (let j = 0; j < tmp.categories.length; j += 1) {
                const checked = findCategory(tab, tmp.categories[j].name);
                if (checked > 0) {
                    tab[checked].info.push(tmp);
                } else
                    tab.push({
                        info: [tmp],
                        category: tmp.categories[j].name,
                    });
            }
        }
        console.log(tab);
        setTech(tab);
    };

    const close = () => {
        setOpen(false);
    };

    const getWappa = async () => {
        setSearching(true);
        setWappaOk(false);
        setOpen(true);
        setMessage('Loading...', 'info');
        await axios
            .get(
                `https://voron.djnn.sh/wapp/get-url?target_url=${wappDomain}`,
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
                setWappaOk(true);
                setMessage('Succeed!', 'success');
                setWappRes(data.data);
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
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
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
    }, [wappRes, wappaOk]);

    return (
        <>
            {modal && <AddNMAP func={modalClick} idRecon={recon.id} />}
            <div className="recon_container">
                <div className="recon_info">
                    <div className="wappa_input_container">
                        <input
                            placeholder="Enter a domain name -> Ex: https://www.voron.djnn.sh"
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
                                    {wappDomain}
                                </h4>
                            </div>
                            {tech && tech.length > 0 ? (
                                <div className="wappa_res_info_tech">
                                    <h5>Technology stacks</h5>
                                    {tech.map((o) => {
                                        return (
                                            <>
                                                <h6>{o.category}</h6>
                                                <div className="wappa_tech_case_container">
                                                    {o.info.map((n) => {
                                                        return (
                                                            <div className="wappa_tech_case">
                                                                <a
                                                                    href={
                                                                        n.website
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {n.name}
                                                                </a>
                                                                {n.version !=
                                                                null ? (
                                                                    <p>
                                                                        version:{' '}
                                                                        {
                                                                            n.version
                                                                        }
                                                                    </p>
                                                                ) : null}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="wappa_res_container">
                            {searching ? (
                                <CircularProgress sx={{ color: '#7c44f3' }} />
                            ) : (
                                <h5 className="error_msg">
                                    Please enter an url to scrape
                                </h5>
                            )}
                        </div>
                    )}
                </div>
                <div className="recon_info">
                    <div className="mission-tool-line">
                        {isPentester && (
                            <button
                                type="button"
                                className="searchBtn wappa_search"
                                onClick={modalClick}
                                style={{ marginBottom: '1rem' }}
                            >
                                <FaPlus
                                    style={{ marginRight: '1rem' }}
                                    color="#fff"
                                />
                                ADD NMAP
                            </button>
                        )}
                    </div>
                    {!records.length ? (
                        <h3 style={{ fontFamily: 'Poppins-Regular' }}>
                            Nothing to show
                        </h3>
                    ) : (
                        <div>
                            {/* <table className="no_center_container">
                                <tbody className="width_fix"> */}
                            {records.map((s_list) => {
                                return (
                                    <Accordion
                                        key={s_list.id}
                                        expanded={
                                            expanded === `panel${s_list.id}`
                                        }
                                        onChange={handleChange(
                                            `panel${s_list.id}`
                                        )}
                                        // style={{ width: '50%' }}
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
                                                <p>IPS : {s_list.ips.length}</p>
                                                <p>
                                                    Ports :{' '}
                                                    {s_list.ports.length}
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
                                                    {s_list!.ips.map((nmap) => {
                                                        return (
                                                            <Tooltip
                                                                title="See more"
                                                                arrow
                                                            >
                                                                <Chip
                                                                    sx={{
                                                                        margin: '8px',
                                                                    }}
                                                                    label={nmap}
                                                                />
                                                            </Tooltip>
                                                        );
                                                    })}
                                                </>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                            {/* </tbody>
                            </table> */}
                        </div>
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

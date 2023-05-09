import React, { useEffect, useState } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import * as IoIcons from 'react-icons/io';
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
export default function Recon(idMission: any) {
    const [recon, setRecon] = useState<IRecon>({
        id: 0,
        updated_at: '2023-05-08T14:29:15.580559Z',
        nmap_runs: [],
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
    const [expanded, setExpanded] = React.useState<string | false>(false);

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

    return (
        <>
            <div className="mission-tool-line">
                <div
                    style={{
                        justifyContent: 'flex-end',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                    className="search-name"
                >
                    <button
                        type="button"
                        className="input_btn mission-borderBtn"
                        onClick={modalClick}
                    >
                        ADD NMAP
                    </button>
                </div>
            </div>
            <table className="no_center_container">
                <tbody>
                    {records.map((s_list) => {
                        return (
                            <Accordion
                                expanded={expanded === `panel${s_list.id}`}
                                onChange={handleChange(`panel${s_list.id}`)}
                            >
                                <AccordionSummary
                                    expandIcon={<IoIcons.IoIosArrowDown />}
                                    aria-controls="panel1bh-content"
                                    sx={{
                                        backgroundColor: 'rgba(0, 0, 0, .02)',
                                    }}
                                    id="panel1bh-header"
                                >
                                    <Stack
                                        direction="row"
                                        spacing={22}
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <p>{s_list.id}</p>
                                        <p>
                                            {s_list.creation_timestamp.slice(
                                                0,
                                                10
                                            )}
                                        </p>
                                        <p>IPS : {s_list.ips.length}</p>
                                        <p>Ports : {s_list.ports.length}</p>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <p>Ports</p>
                                    {!s_list!.ports.length ? (
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
                                            {s_list!.ports.map((nmap) => {
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
                                    <p>IPS</p>
                                    {!s_list!.ips.length ? (
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
                    {modal && <AddNMAP func={modalClick} idRecon={recon.id} />}
                </tbody>
            </table>
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
        </>
    );
}

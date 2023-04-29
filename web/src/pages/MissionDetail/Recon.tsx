import React, { useEffect, useState } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import * as IoIcons from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import scope_list from '../../assets/strings/en/recon.json';
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

export interface IRecon {
    id: number,
    updated_at: string,
    nmap? : INMAP[],
}

export interface INMAP {
    nmap: {
        id: number,
        ips: string [],
        ports:  string [],
        creation_timestamp: string,
        recon: number
    },
}

export default function Recon() {
    const [keyword, setKeyword] = useState('');
    const [recon, setRecon] = useState<IRecon[]>([]);
    const recordsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = recon!.slice(firstIndex, lastIndex);
    const npage = Math.ceil(recon!.length / recordsPerPage);
    const nums = [...Array(npage + 1).keys()].slice(1);
    const navigate = useNavigate();
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

    const searchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setKeyword(event.target.value);
    };

    const getReconList = async () => {
        await axios
            .get(`${config.apiUrl}/recon`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                console.log(data.data.results);
                setRecon(data.data.results);
            })
            .catch((e) => {
                throw e.message;
            });
    };

    useEffect(() => {
        getReconList();
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
                    >
                        ADD RECON
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
                                    sx={{backgroundColor: 'rgba(0, 0, 0, .02)',}}
                                    id="panel1bh-header"
                                >
                                    <Stack direction="row" spacing={22} justifyContent={'space-between'}>
                                        <p>{s_list.id}</p>
                                        <p>{s_list.updated_at}</p>
                                        <p>{s_list.nmap?.length}</p>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {!s_list.nmap?.length ? <h3 style={{fontFamily: "Poppins-Regular"}} className='centered'>Nothing to show</h3> : 
                                    <>
                                    ({s_list!.nmap.map((nmap) => {
                                        return (
                                            <Tooltip title="See more" arrow>
                                                <Chip
                                                sx={{margin: '8px'}}
                                                    label={
                                                        nmap.nmap.creation_timestamp
                                                    }
                                                />
                                            </Tooltip>
                                        );
                                    })})
                                    </>
                                }
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
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

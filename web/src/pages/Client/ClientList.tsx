import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as IoIcons from 'react-icons/io';
import '../Dashboard/Dashboard.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, CircularProgress } from '@mui/material';
import config from '../../config';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import { getCookiePart } from '../../crypto-utils';

export default function ClientList() {
    const [list, setList] = useState<
        {
            name: string;
            id: number;
            occupation: string;
            legacy: string;
            nbEmployees: number;
            mission: number;
        }[]
    >([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = list.slice(firstIndex, lastIndex);
    const npage = Math.ceil(list.length / recordsPerPage);
    const nums = [...Array(npage + 1).keys()].slice(1);
    const navigate = useNavigate();
    const [isLoad, setIsLoad] = useState(false);

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

    const getClientList = async () => {
        setIsLoad(true);
        await axios
            .get(`${config.apiUrl}/client-info?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                const tab = [];
                for (let i = 0; i < data.data.results.length; i += 1) {
                    tab.push({
                        id: data.data.results[i].id,
                        name: data.data.results[i].company_name,
                        nbEmployees: data.data.results[i].nb_employees,
                        mission: data.data.results[i].mission, // get info
                        occupation: data.data.results[i].occupation,
                        legacy: data.data.results[i].legal_entity,
                    });
                }
                tab.reverse();
                setList(tab);
            })
            .catch((e) => {
                throw e.message;
            })
            .finally(() => {
                setIsLoad(false);
            });
    };

    const NavMissionDetail = (id: number) => {
        navigate('/mission/detail', {
            state: {
                missionId: id,
            },
        });
    };

    useEffect(() => {
        getClientList();
    }, []);

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="dashboard-pages">
                    <div className="page-info">
                        <h1>My Clients</h1>
                    </div>
                    <div className="assigned-missions">
                        <div className="dashboard-table">
                            {isLoad ? (
                                <Box sx={{ marginY: '5%' }}>
                                    <CircularProgress color="secondary" />
                                </Box>
                            ) : (
                                <>
                                    {'   '}
                                    {records.length === 0 ? (
                                        <h3
                                            style={{
                                                fontFamily: 'Poppins-Regular',
                                            }}
                                        >
                                            Nothing to show
                                        </h3>
                                    ) : (
                                        <>
                                            <table
                                                style={{ marginTop: '10px' }}
                                                className="no_center_container"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th className="md-3">
                                                            Company Name
                                                        </th>
                                                        <th className="md-6">
                                                            Occupation
                                                        </th>
                                                        <th className="md-3">
                                                            Legal Entity
                                                        </th>
                                                        <th className="md-3">
                                                            Number of employees
                                                        </th>
                                                    </tr>
                                                </thead>
                                                {records.map((client) => {
                                                    return (
                                                        <tbody key="client">
                                                            <tr key={client.id}>
                                                                <td>
                                                                    {
                                                                        client.name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        client.occupation
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        client.legacy
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        client.nbEmployees
                                                                    }
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    );
                                                })}
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
                                                                    currentPage ===
                                                                    n
                                                                        ? 'active'
                                                                        : ''
                                                                }`}
                                                            >
                                                                <a
                                                                    href="#"
                                                                    className="page-link"
                                                                    onClick={() =>
                                                                        changePage(
                                                                            n
                                                                        )
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

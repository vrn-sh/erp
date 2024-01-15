import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as IoIcons from 'react-icons/io';
import '../Dashboard/Dashboard.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, CircularProgress } from '@mui/material';
import config from '../../config';
import DeleteConfirm from '../../component/DeleteConfirm';

export default function TeamList() {
    const [list, setList] = useState<
        {
            name: string;
            id: number;
            nbMember: number;
            nbMission: number;
            manager: string;
        }[]
    >([
        {
            name: 'string',
            id: 2,
            nbMember: 2,
            nbMission: 4,
            manager: 'string',
        },
    ]);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState<{
        id: number;
        title: string;
        type: string;
    }>();
    const [currentPage, setCurrentPage] = useState(1);
    const [mission, setMission] = useState(0);
    const isPentester = Cookies.get('Role') === '1';
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

    const getMission = async (idTeam: number) => {
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                const tab: any = [];
                const missions = data.data.results;
                for (let i = 0; i < missions.length; i += 1) {
                    const find = missions.filter(
                        (elem: any) => elem.team === idTeam
                    );
                    tab.push(find);
                }
                setMission(tab.length);
            })
            .catch((e) => {
                throw e.message;
            })
            .finally(() => {
                setIsLoad(false);
            });
    };

    const addTeam = () => {
        navigate('/team/create');
    };

    const getTeamList = async () => {
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/team?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                const tab = [];
                for (let i = 0; i < data.data.length; i += 1) {
                    getMission(data.data[i].id);
                    tab.push({
                        id: data.data[i].id,
                        name: data.data[i].name,
                        nbMember: data.data[i].members.length,
                        nbMission: mission, // get info
                        manager: data.data[i].leader.auth.username, // get info
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

    const NavEditTeam = (id: number) => {
        navigate('/team/edit', {
            state: {
                teamId: id,
            },
        });
        getTeamList();
    };

    useEffect(() => {
        getTeamList();
    }, []);

    useEffect(() => {
        getTeamList();
    }, [open]);

    const modalClick = () => {
        if (!open) getTeamList();
        setOpen(!open);
    };

    return (
        <div className="dashboard-pages">
            <div className="page-info">
                <h1>Assigned Teams</h1>
            </div>
            <div className="assigned-missions">
                <div className="dashboard-table">
                    {isLoad ? (
                        <Box sx={{ width: '100%', marginY: '5%' }}>
                            <CircularProgress color="secondary" />
                        </Box>
                    ) : (
                        <>
                            {' '}
                            {!list.length ? (
                                <button
                                    type="button"
                                    style={{
                                        width: 'fit-content',
                                    }}
                                    className="mission_create centered"
                                    onClick={addTeam}
                                >
                                    Create a Team
                                </button>
                            ) : (
                                <>
                                    <table
                                        style={{ marginTop: '10px' }}
                                        className="no_center_container"
                                    >
                                        <thead>
                                            <tr>
                                                <th className="md-3">Name</th>
                                                <th className="md-3">
                                                    Manager
                                                </th>
                                                <th className="md-5">
                                                    Members
                                                </th>
                                                <th className="md-5">
                                                    Missions
                                                </th>
                                                {!isPentester && (
                                                    <th className="md-3">
                                                        Action
                                                    </th>
                                                )}
                                            </tr>
                                        </thead>
                                        {records.map((team) => {
                                            return (
                                                <tbody key={team.id}>
                                                    <tr key={team.id}>
                                                        <td>{team.name}</td>
                                                        <td>{team.manager}</td>
                                                        <td>{team.nbMember}</td>
                                                        <td>
                                                            {team.nbMission}
                                                        </td>
                                                        <td className="scope-table-action">
                                                            <input
                                                                type="button"
                                                                value="Open"
                                                                className="openBtn"
                                                                onClick={() => {
                                                                    navigate(
                                                                        `/team/view/${team.id}`
                                                                    );
                                                                }}
                                                            />
                                                            {!isPentester && (
                                                                <>
                                                                    <input
                                                                        type="button"
                                                                        value="Edit"
                                                                        className="borderBtn"
                                                                        onClick={() =>
                                                                            NavEditTeam(
                                                                                team.id
                                                                            )
                                                                        }
                                                                    />
                                                                    <input
                                                                        type="button"
                                                                        value="Delete"
                                                                        className="borderBtnError"
                                                                        onClick={() => {
                                                                            setItem(
                                                                                {
                                                                                    id: team.id,
                                                                                    title: team.name,
                                                                                    type: 'team',
                                                                                }
                                                                            );
                                                                            setOpen(
                                                                                true
                                                                            );
                                                                        }}
                                                                    />
                                                                </>
                                                            )}
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
                        </>
                    )}
                    {open && <DeleteConfirm item={item!} func={modalClick} />}
                </div>
            </div>
        </div>
    );
}

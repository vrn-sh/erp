import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as IoIcons from 'react-icons/io';
import '../Dashboard.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AlertColor, Chip } from '@mui/material';
import dayjs from 'dayjs';
import config from '../../../config';
import DeleteConfirm from '../../../component/DeleteConfirm';

export default function Mission() {
    const [list, setList] = useState<
        {
            name: string;
            id: number;
            team: string;
            status: { color: string; text: string };
        }[]
    >([]);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [item, setItem] = useState<{
        id: number;
        title: string;
        type: string;
    }>();
    const [teamList, setTeamList] = useState<{ id: number; name: string }[]>([
        { id: 0, name: '' },
    ]);
    const isPentester = Cookies.get('Role') === '1';
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = list.slice(firstIndex, lastIndex);
    const npage = Math.ceil(list.length / recordsPerPage);
    const nums = [...Array(npage + 1).keys()].slice(1);
    const navigate = useNavigate();
    const currentDay = dayjs();

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

    const getTeam = async () => {
        await axios
            .get(`${config.apiUrl}/team?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                const tab = [];
                for (let i = 0; i < data.data.results.length; i += 1) {
                    tab.push({
                        id: data.data.results[i].id,
                        name: data.data.results[i].name,
                    });
                }
                setTeamList(tab);
            })
            .catch((e) => {
                throw e.message;
            });
    };

    const getName = (id: number) => {
        const name = teamList.find((elem) => elem.id === id);
        return name ? name.name : '';
    };

    const setStatus = (end: string, start: string) => {
        if (currentDay.isAfter(dayjs(end))) {
            return { color: 'success', text: 'Finish' };
        }
        if (currentDay.isBefore(dayjs(start))) {
            return { color: 'default', text: 'Not Started' };
        }
        if (
            currentDay.isAfter(dayjs(start)) &&
            currentDay.isBefore(dayjs(end))
        ) {
            return { color: 'secondary', text: 'In Progress' };
        }
        return { color: 'secondary', text: 'In Progress' };
    };

    const getMission = async () => {
        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                const tab = [];
                for (let i = 0; i < data.data.results.length; i += 1) {
                    tab.push({
                        id: data.data.results[i].id,
                        name: data.data.results[i].title,
                        team: getName(data.data.results[i].team),
                        status: setStatus(
                            data.data.results[i].end,
                            data.data.results[i].start
                        ) || { color: 'info', text: 'Not Started' },
                    });
                }
                tab.reverse();
                setList(tab);
            })
            .catch((e) => {
                throw e.message;
            });
    };

    const NavEditMission = (id: number) => {
        navigate('/mission/edit', {
            state: {
                missionId: id,
            },
        });
    };

    useEffect(() => {
        getTeam();
        getMission();
    }, []);

    useEffect(() => {
        getTeam();
        getMission();
    }, [open]);

    const modalClick = () => {
        if (!open) getMission();
        setOpen(!open);
    };

    const addMission = () => {
        navigate('/mission/create');
    };

    const NavMissionDetail = () => {
        navigate('/mission/detail');
    };

    return (
        <>
            {!list.length ? (
                <>
                    {isPentester ? (
                        <h3 style={{ fontFamily: 'Poppins-Regular' }}>
                            Nothing to show
                        </h3>
                    ) : (
                        <button
                            type="button"
                            style={{
                                width: 'fit-content',
                            }}
                            className="mission_create centered"
                            onClick={addMission}
                        >
                            Create a mission
                        </button>
                    )}{' '}
                </>
            ) : (
                <>
                    <table
                        style={{ marginTop: '10px' }}
                        className="no_center_container"
                    >
                        {records.map((mission) => {
                            return (
                                <tbody key={mission.id}>
                                    <tr key={mission.id}>
                                        <td>{mission.name}</td>
                                        <td>{mission.team}</td>
                                        <td>
                                            <Chip
                                                label={mission.status.text}
                                                color={
                                                    mission.status
                                                        .color as AlertColor
                                                }
                                                variant="outlined"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="button"
                                                value="Open"
                                                className="openBtn"
                                                onClick={() =>
                                                    NavMissionDetail()
                                                }
                                            />
                                            {!isPentester && (
                                                <>
                                                    <input
                                                        type="button"
                                                        value="Edit"
                                                        className="borderBtn"
                                                        onClick={() =>
                                                            NavEditMission(
                                                                mission.id
                                                            )
                                                        }
                                                    />
                                                    <a
                                                        href="#"
                                                        className="borderBtnError"
                                                        onClick={() => {
                                                            setItem({
                                                                id: mission.id,
                                                                title: mission.name,
                                                                type: 'mission',
                                                            });
                                                            setOpen(true);
                                                        }}
                                                    >
                                                        <IoIcons.IoIosTrash
                                                            size={20}
                                                        />
                                                    </a>
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
            {open && <DeleteConfirm item={item!} func={modalClick} />}
        </>
    );
}

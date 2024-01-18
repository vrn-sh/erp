import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as IoIcons from 'react-icons/io';
import * as AiIcons from 'react-icons/ai';
import '../Dashboard.scss';
import { AlertColor, Box, Chip, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import config from '../../../config';
import DeleteConfirm from '../../../component/DeleteConfirm';
import { getCookiePart } from '../../../crypto-utils';

export default function Mission() {
    const [list, setList] = useState<
        {
            name: string;
            id: number;
            des: string;
            team: string;
            status: { color: string; text: string };
            scope: any;
            vuln: string[];
        }[]
    >([]);
    const [vulnType, setVulnType] = useState<
        {
            id: number;
            name: string;
            description: string;
        }[]
    >([]);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [popup, setPopup] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [poptxt, setPoptxt] = useState('');
    const [item, setItem] = useState<{
        id: number;
        title: string;
        type: string;
    }>();
    const [teamList, setTeamList] = useState<{ id: number; name: string }[]>([
        { id: 0, name: '' },
    ]);
    const [vulSuccess, setVulSuccess] = useState(false);
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';
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
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/team?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then(async (data) => {
                const tab = [];
                const newData = await data.data;
                for (let i = 0; i < newData.length; i += 1) {
                    tab.push({
                        id: data.data[i].id,
                        name: data.data[i].name,
                    });
                }
                setTeamList(tab);
            })
            .catch((e) => {
                throw e.message;
            })
            .finally(() => {
                setIsLoad(false);
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

    const getVulType = async () => {
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/vuln-type?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then(async (data) => {
                const newData = await data.data;
                setVulnType(newData.results);
                setVulSuccess(true);
            })
            .catch((e) => {
                setVulSuccess(false);
                throw e.message;
            })
            .finally(() => {
                setIsLoad(false);
            });
    };

    const getVulData = (newData: any) => {
        const vulnty: string[] = [];

        for (let a = 0; a < newData.length; a += 1) {
            const tmp = vulnType.find((obj) => {
                return obj.id === newData[a];
            });
            if (tmp && vulnty.indexOf(tmp.name) === -1) vulnty.push(tmp.name);
        }
        return vulnty;
    };

    const getMission = async () => {
        const token = getCookiePart(Cookies.get('Token')!, 'token');
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${token}`,
                },
            })
            .then(async (data) => {
                const tab = [];
                for (let i = 0; i < data.data.results.length; i += 1) {
                    let VulnData: any = [];
                    await axios
                        .get(
                            `${config.apiUrl}/vulnerability?page=1&mission_id=${data.data.results[i].id}`,
                            {
                                headers: {
                                    'Content-type': 'application/json',
                                    Authorization: `Token ${token}`,
                                },
                            }
                        )
                        .then(async (res) => {
                            VulnData = await res.data;
                        })
                        .catch((e) => {
                            throw e.message;
                        });
                    const array = [];
                    for (let j = 0; j < VulnData.results.length; j += 1) {
                        if (
                            VulnData.results[j].mission ===
                            data.data.results[i].id
                        ) {
                            array.push(VulnData.results[j].vuln_type);
                        }
                    }
                    tab.push({
                        id: data.data.results[i].id,
                        name: data.data.results[i].title,
                        des: data.data.results[i].description,
                        team: getName(data.data.results[i].team),
                        status: setStatus(
                            data.data.results[i].end,
                            data.data.results[i].start
                        ) || { color: 'info', text: 'Not Started' },
                        scope: data.data.results[i].scope,
                        vuln: getVulData(array),
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

    const NavEditMission = (id: number) => {
        navigate('/mission/edit', {
            state: {
                missionId: id,
            },
        });
    };

    const NavMissionDetail = (id: number) => {
        navigate('/mission/detail', {
            state: {
                missionId: id,
            },
        });
    };

    const NavAddVul = (id: number, name: string) => {
        navigate('/vuln/add', {
            state: {
                missionId: id,
                missionName: name,
            },
        });
    };

    useEffect(() => {
        getVulType();
        getTeam();
    }, []);

    useEffect(() => {
        getMission();
    }, [teamList, vulnType]);

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

    return (
        <div className="dashboard-table">
            {isLoad ? (
                <Box sx={{ marginY: '5%' }}>
                    <CircularProgress color="secondary" />
                </Box>
            ) : (
                <div className="dashboard-content">
                    {list.length === 0 && !vulSuccess ? (
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
                                <thead>
                                    <tr>
                                        <th className="md-1">Mission name</th>
                                        <th className="md-1">Team</th>
                                        <th className="md-2">Badges</th>
                                        <th className="md-1">State</th>
                                        <th className="md-2">Description</th>
                                        <th className="md-3">Actions</th>
                                    </tr>
                                </thead>
                                {records.map((mission) => {
                                    return (
                                        <tbody key={mission.id}>
                                            <tr key={mission.id}>
                                                <td>{mission.name}</td>
                                                <td>{mission.team}</td>
                                                <td>
                                                    {mission.vuln.map((m) => {
                                                        return (
                                                            <Chip
                                                                label={m}
                                                                color="warning"
                                                                variant="filled"
                                                                style={{
                                                                    marginRight:
                                                                        '0.5rem',
                                                                    marginBottom:
                                                                        '2px',
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </td>
                                                <td>
                                                    <Chip
                                                        label={
                                                            mission.status.text
                                                        }
                                                        color={
                                                            mission.status
                                                                .color as AlertColor
                                                        }
                                                        variant="outlined"
                                                    />
                                                </td>
                                                <td>
                                                    <p className="des-overflow">
                                                        {mission.des}
                                                    </p>
                                                    {mission.des.length >
                                                        10 && (
                                                        <a
                                                            onClick={() => {
                                                                setPopup(true);
                                                                setPoptxt(
                                                                    mission.des
                                                                );
                                                            }}
                                                            role="presentation"
                                                            onKeyDown={() => {}}
                                                            className="des-a"
                                                        >
                                                            more
                                                        </a>
                                                    )}
                                                </td>
                                                <td>
                                                    <input
                                                        type="button"
                                                        value="Open"
                                                        className="openBtn"
                                                        onClick={() =>
                                                            NavMissionDetail(
                                                                mission.id
                                                            )
                                                        }
                                                    />
                                                    {isPentester && (
                                                        <input
                                                            type="button"
                                                            value="Add vuln"
                                                            className="borderBtn"
                                                            onClick={() =>
                                                                NavAddVul(
                                                                    mission.id,
                                                                    mission.name
                                                                )
                                                            }
                                                        />
                                                    )}
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
                                                            <input
                                                                type="button"
                                                                value="Delete"
                                                                className="borderBtnError"
                                                                onClick={() => {
                                                                    setItem({
                                                                        id: mission.id,
                                                                        title: mission.name,
                                                                        type: 'mission',
                                                                    });
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
                    {open && <DeleteConfirm item={item!} func={modalClick} />}
                    {popup && (
                        <div className="modal-wrapper-mission">
                            <div className="modal-card-mission">
                                <a
                                    onClick={() => setPopup(false)}
                                    style={{ cursor: 'pointer' }}
                                    role="presentation"
                                    onKeyDown={() => {}}
                                >
                                    <AiIcons.AiOutlineClose />
                                </a>
                                {poptxt}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

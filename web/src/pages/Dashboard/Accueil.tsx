import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Accueil.scss';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Chip, CircularProgress } from '@mui/material';
import Modal from 'react-modal';
import axios from 'axios';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { FaPlus } from 'react-icons/fa6';
import config from '../../config';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import PayLoadForm from './shellcode/PayLoadForm';
import { getCookiePart } from '../../crypto-utils';

Modal.setAppElement('#root'); // Make sure to set your root element here

type SevProps = {
    title: string;
    value: number;
};

type TeamProps = {
    team: {
        id: number;
        members: {
            id: number;
            auth: {
                username: string;
                email: string;
                first_name: string;
                last_name: string;
                last_login: string;
                date_joined: string;
                phone_number: string;
                role: number;
                favorites: string;
                profile_image: string;
            };
            creation_date: string;
        }[];
        name: string;
    };
};

type MissionProps = {
    title: string;
    mission_id: number;
    vuln_list: string[];
    date: string;
    progressValue: number;
};

type MemberProps = {
    name: string;
    photo: string;
};

type ILinearProgressBar = {
    percent: number;
};

function LinearProgressBar({ percent }: ILinearProgressBar) {
    return (
        <div className="mainProgressBarDiv">
            <div className="emptyProgressBar" style={{ width: '100%' }}>
                <div
                    className={
                        percent === 100
                            ? 'greenProgressBar'
                            : 'fillingProgressBar'
                    }
                    style={{
                        left: `${percent - 100}%`,
                        transition: '3s',
                    }}
                />
            </div>
        </div>
    );
}

function SeverityVuln({ title, value }: SevProps) {
    return (
        <div
            style={{
                textAlign: 'left',
                marginLeft: '15px',
                marginRight: '10px',
                marginBottom: '1rem',
            }}
        >
            <label style={{ padding: 0, margin: 0 }}>{title}</label>
            <LinearProgressBar percent={value} />
        </div>
    );
}

function TeamMemberContainer({ name, photo }: MemberProps) {
    return (
        <div className="accueil-team-member-container">
            {photo ? (
                <img src={photo} alt="Profile" className="accueil-team-pp" />
            ) : (
                <FaIcons.FaUserCircle size="24px" color="#8A8A8A" />
            )}
            <p>{name}</p>
        </div>
    );
}

function TeamListContainer({ team }: TeamProps) {
    return (
        <div className="accueil-team-container">
            <p className="accueil-team-title">{team.name}</p>
            {team.members.map((member) => {
                return (
                    <TeamMemberContainer
                        name={member.auth.username}
                        photo={member.auth.profile_image}
                    />
                );
            })}
        </div>
    );
}

function MissionList({
    title,
    mission_id,
    vuln_list,
    date,
    progressValue,
}: MissionProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const BootstrapButton = styled(Button)({
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 14,
        padding: '6px 12px',
        lineHeight: 1.5,
        backgroundColor: 'white',
        fontFamily: 'Poppins-Regular',
        color: '#7c44f3',
        '&:hover': {
            backgroundColor: '#edecee',
            boxShadow: 'none',
            color: '#7c44f3',
        },
    });

    const NavEditMission = (missionId: number) => {
        navigate('/mission/edit', {
            state: {
                missionId,
            },
        });
    };

    const NavMissionDetail = (missionId: number) => {
        navigate('/mission/detail', {
            state: {
                missionId,
                vulnList: vuln_list,
            },
        });
    };

    return (
        <div className="accueil-mission-container">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    textAlign: 'left',
                }}
            >
                <div className="mission-left-half">
                    <label style={{ padding: 0, margin: 0 }}>{title}</label>
                </div>

                <div className="mission-right-half">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignContent: 'center',
                        }}
                    >
                        <p>{date}</p>
                        <p>Preview date</p>
                    </div>
                    <div className="accueil-mission-more">
                        <IconButton aria-describedby={id} onClick={handleClick}>
                            <AiIcons.AiOutlineMore />
                        </IconButton>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            className="Popover"
                        >
                            <BootstrapButton
                                size="small"
                                onClick={() => NavMissionDetail(mission_id)}
                            >
                                Open
                            </BootstrapButton>
                            <BootstrapButton
                                size="small"
                                onClick={() => NavEditMission(mission_id)}
                            >
                                Edit
                            </BootstrapButton>
                        </Popover>
                    </div>
                </div>
            </div>
            <div className="accueil-mission-vuln">
                {vuln_list.map((vuln) => {
                    return (
                        <Chip
                            label={vuln}
                            color="warning"
                            variant="outlined"
                            size="small"
                            style={{
                                marginRight: '10px',
                                fontSize: '10px',
                            }}
                        />
                    );
                })}
            </div>
            <LinearProgressBar percent={progressValue} />
        </div>
    );
}

export default function Accueil() {
    const [numProjects, setNumProjects] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const role = getCookiePart(Cookies.get('Token')!, 'role')?.toString();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [teamList, setTeamList] = useState<
        {
            id: number;
            members: {
                id: number;
                auth: {
                    username: string;
                    email: string;
                    first_name: string;
                    last_name: string;
                    last_login: string;
                    date_joined: string;
                    phone_number: string;
                    role: number;
                    favorites: string;
                    profile_image: string;
                };
                creation_date: string;
            }[];
            name: string;
        }[]
    >([]);
    const [data, setData] = useState([
        { value: 0, label: 'in progress' }, // purple
        { value: 10, label: 'finished' }, // green
        { value: 2, label: 'on hold' }, // gray
    ]);
    const [list, setList] = useState<
        {
            name: string;
            id: number;
            status: number;
            end: string;
            vuln: string[];
        }[]
    >([]);
    const [vulnImport, setVulnImport] = useState<
        {
            name: string;
            value: number;
        }[]
    >([]);
    const [vulnType, setVulnType] = useState<
        {
            id: number;
            name: string;
            description: string;
        }[]
    >([]);

    const currentDay = dayjs();
    const navigate = useNavigate();

    const size = {
        width: 200,
        height: 200,
    };

    const StyledText = styled('text')(({ theme }) => ({
        fill: theme.palette.text.primary,
        textAnchor: 'middle',
        dominantBaseline: 'central',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    }));

    // eslint-disable-next-line
    function PieCenterLabel({ children }: { children: React.ReactNode }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2}>
                {children}
            </StyledText>
        );
    }

    const getVulType = async () => {
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
            .then(async (vulnT) => {
                const newData = await vulnT.data;
                setVulnType(newData.results);
            })
            .catch((e) => {
                throw e.message;
            });
    };

    const getTeamList = async () => {
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
            .then((res) => {
                setTeamList(res.data);
            })
            .catch((e) => {
                throw e.message;
            })
            .finally(() => {
                setIsLoad(false);
            });
    };

    const setStatus = (end: string, start: string) => {
        if (currentDay.isAfter(dayjs(end))) return 100;
        const duration = dayjs(end).diff(dayjs(start), 'days');
        const toToday = dayjs(end).diff(currentDay, 'days');
        const progress = Math.floor((toToday / duration) * 100);
        return progress;
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

    const getVulnSev = (vulnImp: any, vul: []) => {
        for (let x = 0; x < vul.length; x += 1) {
            let found = false;
            for (let y = 0; y < vulnImp.length; y += 1) {
                if (vulnImp[y].name === vul[x]) {
                    found = true;
                    // eslint-disable-next-line
                    vulnImp[y].value += 1;
                }
            }
            if (!found) {
                vulnImp.push({
                    value: 1,
                    name: vul[x],
                });
            }
        }
        return vulnImp;
    };

    const getMission = async () => {
        let vulnImp: any = [];
        let vulnLenth = 0;
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then(async (missions) => {
                const tab = [];
                const project = {
                    'In progress': 0,
                    Succeeded: 0,
                    'On hold': 0,
                };
                const missionData = missions.data.results;
                // number of projects to show
                setNumProjects(missionData.length);
                for (let i = 0; i < missionData.length; i += 1) {
                    let VulnData: any = [];
                    const array = [];
                    await axios
                        .get(`${config.apiUrl}/vulnerability?page=1`, {
                            headers: {
                                'Content-type': 'application/json',
                                Authorization: `Token ${getCookiePart(
                                    Cookies.get('Token')!,
                                    'token'
                                )}`,
                            },
                        })
                        .then(async (res) => {
                            VulnData = await res.data.results;
                        })
                        .catch((e) => {
                            throw e.message;
                        });
                    for (let j = 0; j < VulnData.length; j += 1) {
                        if (VulnData[j].mission === missionData[i].id) {
                            array.push(VulnData[j].vuln_type);
                        }
                    }
                    const vul: any = getVulData(array);
                    tab.push({
                        id: missionData[i].id,
                        name: missionData[i].title,
                        status: setStatus(
                            missionData[i].end,
                            missionData[i].start
                        ),
                        end: missionData[i].end,
                        vuln: vul,
                    });
                    const s = missionData[i].status;
                    if (s === 'In progress') project['In progress'] += 1;
                    else project.Succeeded += 1;
                    vulnLenth += vul.length;
                    vulnImp = getVulnSev(vulnImp, vul);
                }
                tab.reverse();
                setList(tab);
                vulnImp.push({
                    value: vulnLenth,
                    name: 'total',
                });
                setVulnImport(vulnImp);
                // set for piechart
                setData([
                    { value: project['In progress'], label: 'In progress' },
                    { value: project.Succeeded, label: 'Succeeded' },
                    { value: project['On hold'], label: 'On hold' },
                ]);
            })
            .catch((e) => {
                throw e.message;
            })
            .finally(() => {
                setIsLoad(false);
            });
    };

    useEffect(() => {
        getVulType();
    }, []);

    useEffect(() => {
        getMission();
        getTeamList();
    }, [vulnType.length]);

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="dashboard-pages">
                    <div className="page-info">
                        <h1>Overviews</h1>
                        <button
                            type="button"
                            className="borderBtn"
                            style={{ marginRight: '5rem' }}
                            onClick={openModal}
                        >
                            Generate payload
                        </button>

                        <PayLoadForm
                            isModalOpen={isModalOpen}
                            closeModal={closeModal}
                        />
                    </div>
                    <div className="accueil-container">
                        <div className="accueil-grid-3">
                            <div
                                className="accueil-rect"
                                style={{ height: '30vh' }}
                            >
                                <h5>Projects analytics</h5>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <PieChart
                                        colors={[
                                            '#A687E9',
                                            '#55D872',
                                            '#EAEBEE',
                                        ]}
                                        series={[
                                            {
                                                data,
                                                innerRadius: 70,
                                                outerRadius: 50,
                                            },
                                        ]}
                                        sx={{
                                            '--ChartsLegend-itemWidth': '30px',
                                            '--ChartsLegend-itemMarkSize':
                                                '10px',
                                            '--ChartsLegend-rootSpacing':
                                                '30px',
                                        }}
                                        margin={{ left: 80, top: -10 }}
                                        {...size}
                                        slotProps={{
                                            legend: {
                                                direction: 'row',
                                                position: {
                                                    vertical: 'bottom',
                                                    horizontal: 'middle',
                                                },
                                            },
                                        }}
                                        legend={{ hidden: true }}
                                    >
                                        <PieCenterLabel>
                                            {numProjects} projects
                                        </PieCenterLabel>
                                    </PieChart>
                                </div>
                            </div>

                            <div
                                className="accueil-rect"
                                style={{ height: '35vh' }}
                            >
                                <h5 style={{ marginBottom: '15px' }}>
                                    Top severity of Vulnerability
                                </h5>
                                {isLoad ? (
                                    <CircularProgress
                                        style={{
                                            marginTop: '8vh',
                                            marginLeft: '8vw',
                                        }}
                                        color="secondary"
                                    />
                                ) : (
                                    <div className="rect-scroll">
                                        {vulnImport && vulnImport.length > 0 ? (
                                            <>
                                                {' '}
                                                {vulnImport.map((vul) => {
                                                    return (
                                                        vul.name !==
                                                            'total' && (
                                                            <SeverityVuln
                                                                title={vul.name}
                                                                value={
                                                                    (100 / 8) *
                                                                    vul.value
                                                                }
                                                            />
                                                        )
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <p style={{ marginTop: '8vh' }}>
                                                Nothing to show
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="accueil-grid-3">
                            <div className="accueil-rect-long">
                                <div className="accueil-mission-title">
                                    <h5 style={{ marginBottom: '15px' }}>
                                        My mission
                                    </h5>
                                    {role !== '1' && (
                                        <button
                                            type="submit"
                                            className="accueil-create-mission"
                                            onClick={() => {
                                                navigate('/mission/create');
                                            }}
                                        >
                                            <FaPlus
                                                color="#7c44f3"
                                                style={{ marginRight: '.3rem' }}
                                            />{' '}
                                            Add mission
                                        </button>
                                    )}
                                </div>
                                {isLoad ? (
                                    <CircularProgress
                                        style={{
                                            marginTop: '22vh',
                                            marginLeft: '11vw',
                                        }}
                                        color="secondary"
                                    />
                                ) : (
                                    <div className="rect-scroll">
                                        {list && list.length > 0 ? (
                                            <>
                                                {list.map((mission) => {
                                                    return (
                                                        <MissionList
                                                            title={mission.name}
                                                            mission_id={
                                                                mission.id
                                                            }
                                                            vuln_list={
                                                                mission.vuln
                                                            }
                                                            date={mission.end}
                                                            progressValue={
                                                                mission.status
                                                            }
                                                        />
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <p style={{ marginTop: '22vh' }}>
                                                Nothing to show
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="accueil-grid-3">
                            <div className="accueil-rect-long">
                                <div className="accueil-mission-title">
                                    <h5
                                        style={{
                                            marginBottom: '15px',
                                            position: 'sticky',
                                        }}
                                    >
                                        Co-workers
                                    </h5>
                                    {role !== '1' && (
                                        <button
                                            type="submit"
                                            className="accueil-create-mission"
                                            onClick={() => {
                                                navigate('/mission/create');
                                            }}
                                        >
                                            <FaPlus
                                                color="#7c44f3"
                                                style={{ marginRight: '.3rem' }}
                                            />{' '}
                                            Add team
                                        </button>
                                    )}
                                </div>
                                {isLoad ? (
                                    <CircularProgress
                                        style={{
                                            marginTop: '22vh',
                                            marginLeft: '11vw',
                                        }}
                                        color="secondary"
                                    />
                                ) : (
                                    <div className="rect-scroll">
                                        {teamList && teamList.length > 0 ? (
                                            <>
                                                {teamList.map((t) => {
                                                    return (
                                                        <TeamListContainer
                                                            team={t}
                                                        />
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <p style={{ marginTop: '22vh' }}>
                                                Nothing to show
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

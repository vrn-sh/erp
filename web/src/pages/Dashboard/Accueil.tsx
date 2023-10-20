import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Accueil.scss';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import * as AiIcons from 'react-icons/ai';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import config from '../../config';
import pp from '../../assets/testpp2.jpg';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';

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
    date: string;
    progressValue: number;
};

type MemberProps = {
    name: string;
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

function TeamMemberContainer({ name }: MemberProps) {
    return (
        <div className="accueil-team-member-container">
            <img src={pp} alt="profile-pp" className="accueil-team-pp" />
            <p>{name}</p>
        </div>
    );
}

function TeamListContainer({ team }: TeamProps) {
    return (
        <div className="accueil-team-container">
            <p className="accueil-team-title">{team.name}</p>
            {team.members.map((member) => {
                return <TeamMemberContainer name={member.auth.username} />;
            })}
            <TeamMemberContainer name="co-worker2" />
            <TeamMemberContainer name="co-worker3" />
            <TeamMemberContainer name="co-worker4" />
        </div>
    );
}

function MissionList({ title, mission_id, date, progressValue }: MissionProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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

    return (
        <div className="accueil-mission-container">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    textAlign: 'left',
                    marginBottom: '1rem',
                }}
            >
                <div className="mission-left-half">
                    <label style={{ padding: 0, margin: 0 }}>{title}</label>
                    {/* <Chip
                        label={Vuln}
                        color="warning"
                        variant="outlined"
                        size="small"
                        style={{
                            margin: 0,
                            fontSize: '10px',
                        }}
                    /> */}
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
                            <BootstrapButton size="small">Open</BootstrapButton>
                            <BootstrapButton size="small">Edit</BootstrapButton>
                        </Popover>
                    </div>

                    <div />
                </div>
            </div>
            <LinearProgressBar percent={progressValue} />
        </div>
    );
}

export default function Accueil() {
    const [numProjects, setNumProjects] = useState(3);
    const navigate = useNavigate();
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
    const [list, setList] = useState<
        {
            name: string;
            id: number;
            status: number;
            end: string;
            vuln: string;
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

    const data = [
        { value: 5, label: 'in progress' }, // purple
        { value: 10, label: 'finished' }, // green
        { value: 15, label: 'on hold' }, // gray
    ];

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

    const getTeamList = async () => {
        await axios
            .get(`${config.apiUrl}/team?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((res) => {
                setTeamList(res.data);
            })
            .catch((e) => {
                throw e.message;
            });
    };

    const setStatus = (end: string, start: string) => {
        if (currentDay.isAfter(dayjs(end))) return 100;
        const duration = dayjs(end).diff(dayjs(start), 'days');
        const toToday = dayjs(end).diff(currentDay, 'days');
        const progress = Math.floor((toToday / duration) * 100);
        console.log(duration, toToday, progress);
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
        return vulnty[0];
    };

    const getMission = async () => {
        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
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
                                    Authorization: `Token ${Cookies.get(
                                        'Token'
                                    )}`,
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
                    for (let j = 0; j < VulnData.length; j += 1) {
                        if (VulnData[j].mission === data.data.results[i].id) {
                            array.push(VulnData[j].vuln_type);
                        }
                    }
                    tab.push({
                        id: data.data.results[i].id,
                        name: data.data.results[i].title,
                        status: setStatus(
                            data.data.results[i].end,
                            data.data.results[i].start
                        ),
                        end: data.data.results[i].end,
                        vuln: getVulData(array),
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

    const NavMissionDetail = (id: number) => {
        navigate('/mission/detail', {
            state: {
                missionId: id,
            },
        });
    };

    useEffect(() => {
        getMission();
        getTeamList();
    }, []);

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="dashboard-pages">
                    <div className="page-info">
                        <h1>Overviews</h1>
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
                                <div className="rect-scroll">
                                    <SeverityVuln
                                        title="XSS-Medium"
                                        value={76}
                                    />
                                    <SeverityVuln
                                        title="Insecure Design"
                                        value={45}
                                    />
                                    <SeverityVuln title="Injection" value={5} />
                                </div>
                            </div>
                        </div>

                        <div className="accueil-grid-3">
                            <div className="accueil-rect-long">
                                <h5 style={{ marginBottom: '15px' }}>
                                    My mission
                                </h5>
                                <div className="rect-scroll">
                                    {list.map((mission) => {
                                        return (
                                            <MissionList
                                                title={mission.name}
                                                mission_id={mission.id}
                                                // Vuln={mission.vuln}
                                                date={mission.end}
                                                progressValue={mission.status}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="accueil-grid-3">
                            <div className="accueil-rect-long">
                                <h5
                                    style={{
                                        marginBottom: '15px',
                                        position: 'sticky',
                                    }}
                                >
                                    Co-workers
                                </h5>
                                <div className="rect-scroll">
                                    {teamList.map((t) => {
                                        return <TeamListContainer team={t} />;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

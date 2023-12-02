import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Accueil.scss';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import Modal from 'react-modal';
import axios from 'axios';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import config from '../../config';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import formRows from '../../assets/strings/en/payload.json';

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
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openNewModal = () => {
        setIsNewModalOpen(true);
    };

    const closeNewModal = () => {
        setIsNewModalOpen(false);
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
    const [formData, setFormData] = useState<{
        [key: string]: string;
    }>({
        lport: '4444',
        laddr: '10.0.2.2',
        exploit: 'x64/shell_reverse_tcp',
        arch: 'x64',
        os: 'windows',
        output_type: 'exe',
    });
    const currentDay = dayjs();

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    async function submitPayload() {
        const apiKey = 'c9083d45b7a867f26772f3f0a8c104a2';
        const apiUrl = `http://voron.djnn.sh/saas/load_shellcode?lport=${
            formData.lport
        }&laddr=${formData.laddr}&exploit=${encodeURIComponent(
            formData.exploit
        )}&arch=${formData.arch}&os=${formData.os}&output_type=${
            formData.output_type
        }`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify(formData),
        });

        // Check if the response status is in the success range (e.g., 200-299)
        if (response.status >= 200 && response.status < 300) {
            // Read the response body as a blob
            const fileBlob = await response.blob();

            const url = window.URL.createObjectURL(fileBlob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'file.exe';

            a.click();

            window.URL.revokeObjectURL(url);
        } else {
            // Handle error status code (e.g., display an error message)
            console.error(`API Request Error: Status Code ${response.status}`);
        }
    }

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
                    Authorization: `Token ${Cookies.get('Token')}`,
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
            if (found === false) {
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
        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
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
                                Authorization: `Token ${Cookies.get('Token')}`,
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
                            className="btn"
                            onClick={openModal}
                        >
                            Generate payload
                        </button>
                        <form
                            style={{
                                display: isModalOpen ? 'block' : 'none',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Modal
                                isOpen={isModalOpen}
                                onRequestClose={closeModal}
                                contentLabel="General Payload Modal"
                                style={{
                                    content: {
                                        border: '1px solid #ccc',
                                        borderRadius: '10px',
                                    },
                                }}
                            >
                                {/* Content inside the modal (copy from old mission page) */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <h2>General payload</h2>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={openNewModal}
                                    >
                                        Documentation
                                    </button>
                                    <Modal
                                        isOpen={isNewModalOpen}
                                        onRequestClose={closeNewModal}
                                        contentLabel="Documentation Modal"
                                        style={{
                                            content: {
                                                border: '1px solid #ccc',
                                                borderRadius: '10px',
                                                position: 'absolute',
                                                overflow: 'scroll',
                                            },
                                        }}
                                    >
                                        <h2>saas documentation</h2>

                                        <div>
                                            <h3>Server Overview</h3>
                                            <p>
                                                The server is an entry point for
                                                handling various routes related
                                                to shellcode operations. It uses
                                                FastAPI, a modern, fast web
                                                framework for building APIs with
                                                Python. CORS is enabled for all
                                                origins.
                                            </p>

                                            <h3>Endpoints</h3>
                                            <ul>
                                                <li>
                                                    <strong>GET /</strong>
                                                    <p>
                                                        Description: Basic root
                                                        route that returns a
                                                        simple greeting.
                                                    </p>
                                                    <p>
                                                        Response: Returns a JSON
                                                        object Hello: World
                                                    </p>
                                                </li>
                                                <li>
                                                    <strong>
                                                        POST /load_shellcode
                                                    </strong>
                                                    <p>
                                                        Description: Main route
                                                        to get a simple
                                                        shellcode. This endpoint
                                                        generates a payload
                                                        based on the provided
                                                        parameters.
                                                    </p>
                                                    <p>
                                                        Parameters: lport,
                                                        laddr, exploit, arch,
                                                        os, output_type, method,
                                                        exit_func, encoder,
                                                        exclude_bytes, entropy.
                                                    </p>
                                                    <p>
                                                        Response: Success -
                                                        Returns a file response
                                                        with the generated
                                                        executable. Failure -
                                                        Returns an error message
                                                        in JSON format.
                                                    </p>
                                                </li>
                                                <li>
                                                    <strong>
                                                        GET /aes-revshell
                                                    </strong>
                                                    <p>
                                                        Description: Loads an
                                                        AES-over-TCP
                                                        reverse-shell payload.
                                                    </p>
                                                    <p>
                                                        Response: Returns a file
                                                        response with a
                                                        predefined AES
                                                        reverse-shell
                                                        executable.
                                                    </p>
                                                </li>
                                                <li>
                                                    <strong>
                                                        GET /tcp-revshell
                                                    </strong>
                                                    <p>
                                                        Description: Loads a TCP
                                                        reverse-shell payload.
                                                    </p>
                                                    <p>
                                                        Response: Returns a file
                                                        response with the
                                                        generated TCP
                                                        reverse-shell
                                                        executable.
                                                    </p>
                                                </li>
                                            </ul>

                                            <h3>Running the Server</h3>
                                            <p>
                                                The server is configured to run
                                                on 0.0.0.0 at port 1337. To
                                                start the server, run the main
                                                block which invokes uvicorn.
                                            </p>

                                            <h3>Additional Notes</h3>
                                            <p>
                                                The server relies on external
                                                dependencies like MinGW and uses
                                                subprocess calls for certain
                                                operations. Error handling is
                                                implemented in the
                                                /load_shellcode route, with
                                                checks for payload validity and
                                                MinGW installation.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={closeNewModal}
                                        >
                                            Close
                                        </button>
                                    </Modal>
                                </div>
                                <div className="form-row">
                                    <div
                                        className="columnTitle"
                                        style={{
                                            fontFamily: 'Poppins-Medium',
                                            border: '1px solid #ccc',
                                            borderRadius: '10px',
                                            marginRight: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <label>Name</label>
                                    </div>
                                    <div
                                        className="columnTitle"
                                        style={{
                                            fontFamily: 'Poppins-Medium',
                                            border: '1px solid #ccc',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <label>Description</label>
                                    </div>
                                </div>
                                {formRows.map((row) => (
                                    <div className="form-row">
                                        <div className="column">
                                            <div className="small-row">
                                                {row.label}
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="small-row-default">
                                                Default value:{' '}
                                                {row.defaultValue}
                                            </div>
                                            <div
                                                className="small-row"
                                                style={{
                                                    borderRadius: '10px',
                                                    border: '1px solid #ccc',
                                                    padding: '5px',
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    name={row.name}
                                                    placeholder={
                                                        row.placeholder
                                                    }
                                                    value={formData[row.name]}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        width: '100%',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={submitPayload}>
                                    Submit
                                </button>
                                <button type="button" onClick={closeModal}>
                                    Close
                                </button>
                            </Modal>
                        </form>
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
                                    {vulnImport &&
                                        vulnImport.map((vul) => {
                                            return (
                                                vul.name !== 'total' && (
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
                                                vuln_list={mission.vuln}
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

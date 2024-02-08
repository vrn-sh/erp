import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as AiIcons from 'react-icons/ai';
import * as TbIcons from 'react-icons/tb';
import { Avatar, Chip, Switch } from '@mui/material';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import Scope from './Scope';
import Recon from './Recon';
import Feedbacks from '../../component/Feedback';
import HunterIo from './HunterIo/HunterIo';
import Credentials from './Credential';
import config from '../../config';
import { getCookiePart } from '../../crypto-utils';
import DorkEngine from '../Dashboard/SubDashboards/DorkEngine';
import CrtSh from '../Dashboard/SubDashboards/CrtSh';
import Notes from '../Dashboard/SubDashboards/Notes/Notes';
import Report from '../Dashboard/SubDashboards/Report/Report';
import Vulnerability from '../Dashboard/SubDashboards/Vulnerability';
import ClientInfo from './ClientInfo';

export default function MissionDetail() {
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';
    const [active, setActive] = useState('client');
    const [id, setId] = useState(0);
    const [Title, setTitle] = useState('');
    const [logo, setLogo] = useState('');
    const [status, setStatus] = useState('');
    const [Team, setTeam] = useState(0);
    const [TeamName, setTeamName] = useState('');
    const [missionDes, setMissionDes] = useState('');
    const [popup, setPopup] = useState(false);
    const location = useLocation();
    const [isFavory, setIsFavory] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<string[]>();
    const role = getCookiePart(Cookies.get('Token')!, 'role')?.toString();

    const handleClick = (event: any) => {
        setActive(event.target.id);
    };

    const getUserInfo = async () => {
        let url = `${config.apiUrl}/`;
        if (getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '3') {
            url += 'freelancer';
        } else if (
            getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '2'
        ) {
            url += 'manager';
        } else {
            url += 'pentester';
        }
        await axios
            .get(`${url}/${getCookiePart(Cookies.get('Token')!, 'id')}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                setUserInfo(data.data.auth.favorites);
            })
            .catch((e) => {
                throw e;
            });
    };

    const handleAdd = async (val: string[]) => {
        let url = `${config.apiUrl}/`;
        if (getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '3') {
            url += 'freelancer';
        } else if (
            getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '2'
        ) {
            url += 'manager';
        } else {
            url += 'pentester';
        }
        await axios
            .patch(
                `${url}/${getCookiePart(Cookies.get('Token')!, 'id')}`,
                JSON.stringify({
                    auth: {
                        favorites: val,
                    },
                }),
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
            .then(() => {
                setMess({ mess: 'Added to Favory', color: 'success' });
            })
            .catch((e) => {
                setMess({ mess: 'e.message', color: 'error' });
                throw e;
            });
    };

    const addFavory = () => {
        let val = userInfo;
        if (userInfo && !isFavory) {
            if (val!.length < 3) {
                val!.push(id.toString());
                setIsFavory(true);
                setOpen(true);
                handleAdd(val!);
            } else {
                setMess({
                    mess: 'Limit reached please remove from favorites',
                    color: 'error',
                });
                setOpen(true);
            }
        } else {
            // eslint-disable-next-line
            val = [id.toString()];
            setIsFavory(true);
            setOpen(true);
            handleAdd(val!);
        }
    };

    const deleteFavory = async () => {
        let url = `${config.apiUrl}/`;
        if (getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '3') {
            url += 'freelancer';
        } else if (
            getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '2'
        ) {
            url += 'manager';
        } else {
            url += 'pentester';
        }
        if (userInfo && isFavory) {
            const val = userInfo;
            for (let i = 0; i < val.length; i += 1) {
                // eslint-disable-next-line
                if (parseInt(val[i]) === id) {
                    val.splice(i, 1);
                }
            }
            setUserInfo(val);
            setOpen(true);
            await axios
                .patch(
                    `${url}/${getCookiePart(Cookies.get('Token')!, 'id')}`,
                    JSON.stringify({
                        auth: {
                            favorites: val,
                        },
                    }),
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
                .then(() => {
                    setMess({ mess: 'Deleted !', color: 'success' });
                    setIsFavory(false);
                })
                .catch((e) => {
                    setMess({ mess: 'e.message', color: 'error' });
                    throw e;
                });
        }
    };

    const getMissionInfo = async () => {
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
                setTitle(data.data.title);
                setLogo(data.data.logo);
                setStatus(data.data.status);
                setTeam(data.data.team);
                setMissionDes(data.data.description);
            })
            .catch((e) => {
                throw e;
            });
    };

    const getTeam = async () => {
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
            .then((data) => {
                const newData = data.data;
                for (let i = 0; i < newData.length; i += 1)
                    if (data.data[i].id === Team)
                        setTeamName(data.data[i].name);
            })
            .catch((e) => {
                throw e.message;
            });
    };

    const close = () => {
        setOpen(false);
    };

    const handleFavory = () => {
        if (isFavory) {
            deleteFavory();
        } else {
            addFavory();
        }
    };

    const checkFavory = () => {
        if (userInfo) {
            for (let i = 0; i < userInfo.length; i += 1) {
                // eslint-disable-next-line
                if (Number(userInfo[i]) == id) {
                    setIsFavory(true);
                }
            }
        }
    };

    const NavEditMission = (mission_id: number) => {
        navigate('/mission/edit', {
            state: {
                missionId: mission_id,
            },
        });
    };

    useEffect(() => {
        setId(location.state.missionId);
    }, []);

    useEffect(() => {
        getUserInfo();
        // eslint-disable-next-line
        if (id != 0) {
            getMissionInfo();
        }
    }, [id]);

    useEffect(() => {
        getTeam();
    }, [Team]);

    useEffect(() => {
        checkFavory();
    }, [userInfo]);

    const getSubMissionDetail = () => {
        if (active === 'client') {
            return <ClientInfo />;
        }
        if (active === 'scope') {
            return <Scope />;
        }
        if (active === 'note') {
            return <Notes />;
        }
        if (active === 'vuln') {
            return <Vulnerability missionName={Title} />;
        }
        if (active === 'recon') {
            return <Recon id={id} />;
        }
        if (active === 'hunter') {
            return <HunterIo />;
        }
        if (active === 'credential') {
            return <Credentials idMission={id} />;
        }
        if (active === 'dork') {
            return <DorkEngine />;
        }
        if (active === 'crt') {
            return <CrtSh />;
        }
        if (active === 'report') {
            return <Report />;
        }
        return null;
    };

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="mission-detail-container">
                    <div className="mission-detail-topline">
                        <h1>
                            {logo && (
                                <div style={{ margin: '10px' }}>
                                    <Avatar
                                        alt="Logo"
                                        sx={{ width: 60, height: 60 }}
                                        src={logo}
                                    />
                                </div>
                            )}
                            {Title}
                            {isFavory ? (
                                <AiIcons.AiFillStar
                                    className="scope-action-icons"
                                    style={{ color: 'orange' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleFavory();
                                    }}
                                />
                            ) : (
                                <AiIcons.AiOutlineStar
                                    className="scope-action-icons"
                                    style={{ color: 'orange' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleFavory();
                                    }}
                                />
                            )}
                        </h1>

                        <div>
                            {!isPentester && (
                                <button
                                    type="submit"
                                    className="editBtn"
                                    onClick={() => {
                                        NavEditMission(id);
                                    }}
                                >
                                    Edit Mission
                                </button>
                            )}
                            <Chip
                                label={status}
                                color={
                                    status === 'In progress'
                                        ? 'warning'
                                        : 'success'
                                }
                                variant="outlined"
                                size="medium"
                                style={{
                                    marginRight: '10px',
                                    fontSize: '12px',
                                }}
                            />
                        </div>
                    </div>
                    <div className="mission-detail-team">
                        <AiIcons.AiOutlineTeam size={20} color="#7c44f3" />
                        <p>{TeamName}</p>
                    </div>
                    {missionDes && (
                        <div className="mission-detail-team">
                            <TbIcons.TbFileDescription
                                size={20}
                                color="#7c44f3"
                            />
                            <p>{missionDes}</p>
                            {missionDes.length > 60 && (
                                <a
                                    role="presentation"
                                    onClick={() => setPopup(true)}
                                    onKeyDown={() => {}}
                                >
                                    Read more
                                </a>
                            )}
                        </div>
                    )}
                    <div className="subHeader">
                        <div className="submenu-mission">
                            <button
                                key={1}
                                id="client"
                                type="button"
                                className={
                                    active === 'client' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Client info
                            </button>
                            <button
                                key={2}
                                id="scope"
                                type="button"
                                className={
                                    active === 'scope' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                scope
                            </button>
                            <button
                                key={3}
                                id="note"
                                type="button"
                                className={
                                    active === 'note' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Note
                            </button>
                            <button
                                key={4}
                                id="vuln"
                                type="button"
                                className={
                                    active === 'vuln' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Vulnerability
                            </button>
                            <button
                                key={5}
                                id="recon"
                                type="button"
                                className={
                                    active === 'recon' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Recon
                            </button>
                            <button
                                key={6}
                                id="hunter"
                                type="button"
                                className={
                                    active === 'hunter' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Hunter IO
                            </button>
                            <button
                                key={7}
                                id="credential"
                                type="button"
                                className={
                                    active === 'credential'
                                        ? 'active'
                                        : undefined
                                }
                                onClick={handleClick}
                            >
                                Credentials
                            </button>
                            <button
                                key={8}
                                id="dork"
                                type="button"
                                className={
                                    active === 'dork' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Dork Engine
                            </button>
                            {isPentester && (
                                <button
                                    key={9}
                                    id="crt"
                                    type="button"
                                    className={
                                        active === 'crt' ? 'active' : undefined
                                    }
                                    onClick={handleClick}
                                >
                                    Crtsh
                                </button>
                            )}
                            <button
                                key={10}
                                id="report"
                                type="button"
                                className={
                                    active === 'report' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Report
                            </button>
                        </div>
                    </div>
                    {getSubMissionDetail()}
                </div>
                {open && (
                    <Feedbacks
                        mess={message.mess}
                        color={message.color}
                        close={close}
                        open={open}
                    />
                )}
                {popup && (
                    <div className="modal-wrapper-mission">
                        <div className="modal-card-mission">
                            <a
                                role="presentation"
                                onKeyDown={() => {}}
                                onClick={() => setPopup(false)}
                            >
                                <AiIcons.AiOutlineClose />
                            </a>
                            {missionDes}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as AiIcons from 'react-icons/ai';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import Scope from './Scope';
import Recon from './Recon';
import Feedbacks from '../../component/Feedback';
import HunterIo from './HunterIo/HunterIo';
import config from '../../config';

export default function MissionDetail() {
    const [active, setActive] = useState('scope');
    const [id, setId] = useState(0);
    const location = useLocation();
    const [isFavory, setIsFavory] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [open, setOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<string[]>();
    const url =
        Cookies.get('Role') === '2'
            ? `${config.apiUrl}/manager`
            : `${config.apiUrl}/pentester`;

    const handleClick = (event: any) => {
        setActive(event.target.id);
    };

    const getUserInfo = async () => {
        await axios
            .get(`${url}/${Cookies.get('Id')}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
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
        console.log(url);
        await axios
            .patch(
                `${url}/${Cookies.get('Id')}`,
                JSON.stringify({
                    auth: {
                        favorites: val,
                    },
                }),
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${Cookies.get('Token')}`,
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
                    mess: 'limite atteinte veuillez supprimer des favoris',
                    color: 'error',
                });
                setOpen(true);
            }
        } else {
            val = val === undefined ? [id.toString()] : [id.toString(), ...val];
            setIsFavory(true);
            setOpen(true);
            handleAdd(val!);
        }
    };

    const deleteFavory = async () => {
        if (userInfo && isFavory) {
            const val = userInfo;
            for (let i = 0; i < val.length; i += 1) {
                if (Number(val[i]) === id) {
                    val.splice(i, 1);
                }
            }
            setIsFavory(false);
            setUserInfo(val);
            setOpen(true);
            await axios
                .patch(
                    `${url}/${Cookies.get('Id')}`,
                    JSON.stringify({
                        auth: {
                            favorites: val,
                        },
                    }),
                    {
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: `Token ${Cookies.get('Token')}`,
                        },
                    }
                )
                .then(() => {
                    setMess({ mess: 'Deleted !', color: 'success' });
                })
                .catch((e) => {
                    setMess({ mess: 'e.message', color: 'error' });
                    throw e;
                });
        }
    };

    const close = () => {
        setOpen(false);
    };

    const handleFavory = () => {
        if (isFavory) {
            console.log('delete');
            deleteFavory();
        } else {
            console.log('add');
            addFavory();
        }
    };

    const checkFavory = () => {
        if (userInfo) {
            for (let i = 0; i < userInfo.length; i += 1) {
                if (Number(userInfo[i]) === id) {
                    setIsFavory(true);
                }
            }
        }
    };

    useEffect(() => {
        setId(location.state.missionId);
    }, []);

    useEffect(() => {
        getUserInfo();
        checkFavory();
    }, [id]);

    useEffect(() => {
        checkFavory();
    }, [userInfo]);

    const getSubMissionDetail = () => {
        if (active === 'scope') {
            return <Scope />;
        }
        if (active === 'recon') {
            return <Recon id={id} />;
        }
        if (active === 'hunter') {
            return <HunterIo />;
        }
        return null;
    };

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="mission-detail-container">
                    <h1>
                        Fame mission web
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
                    <p>Additional description if required</p>

                    <div className="subHeader">
                        <div className="submenu-mission">
                            {/* <button
                                key={1}
                                id="scope"
                                type="button"
                                className={
                                    active === 'scope' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Scope
                            </button> */}
                            <button
                                key={2}
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
                                key={3}
                                id="hunter"
                                type="button"
                                className={
                                    active === 'hunter' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Hunter IO
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
            </div>
        </div>
    );
}

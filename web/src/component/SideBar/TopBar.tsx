import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
    Box,
    CircularProgress,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    scopedCssBaselineClasses,
} from '@mui/material';
import { Fade, List } from 'reactstrap';
import { AiFillBug } from 'react-icons/ai';
import { TbTargetArrow } from 'react-icons/tb';
import { BsFillPeopleFill, BsFillPersonFill } from 'react-icons/bs';
import { SecondaryButton } from '../Button';
import config from '../../config';
import { getCookiePart } from '../../crypto-utils';

interface SearchModalProps {
    exit: React.MouseEventHandler<HTMLButtonElement>;
}

function SearchModal({ exit }: SearchModalProps) {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchInfo, setSearchInfo] = useState([
        {
            id: 0,
            title: '',
            model: '',
        },
    ]);
    const navigate = useNavigate();
    // const exit = props.func;

    const redirection = (info: { model: any; id: any }) => {
        switch (info.model) {
            case 'Vulnerability':
                navigate('/vuln/detail', {
                    state: {
                        vulnId: info.id,
                    },
                });
                break;
            case 'Mission':
                navigate('/mission/detail', {
                    state: {
                        missionId: info.id,
                    },
                });
                break;
            case 'Manager':
                navigate('/profile');
                break;
            case 'Pentester':
                navigate('/profile');
                break;
            case 'Team':
                navigate(`/team/view/${info.id}`);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async () => {
        await axios
            .get(`${config.apiUrl}/search?q=${keyword}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                setSearchInfo(data.data.results);
                setLoading(false);
            })
            .catch((e) => {
                if (e.response.status === 404) {
                    setSearchInfo([
                        {
                            id: 0,
                            title: '',
                            model: '',
                        },
                    ]);
                    setLoading(false);
                } else throw e;
            });
    };

    const whatIcon = (model: string) => {
        let icon: any;

        switch (model) {
            case 'Vulnerability':
                icon = <AiFillBug size="25px" />;
                break;
            case 'Mission':
                icon = <TbTargetArrow size="25px" />;
                break;
            case 'Manager':
                icon = <BsFillPersonFill size="25px" />;
                break;
            case 'Pentester':
                icon = <BsFillPersonFill size="25px" />;
                break;
            case 'Team':
                icon = <BsFillPeopleFill size="25px" />;
                break;
            default:
                break;
        }

        return icon;
    };

    const enter = (event: any) => {
        if (event.keyCode === 13) {
            handleSubmit();
        }
    };

    const searchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setKeyword(event.target.value);
        setLoading(true);
    };

    return (
        <div className="search-modal-wrapper">
            <div className="search-modal-card">
                <div className="search-modal">
                    <div
                        className="modal-header centered"
                        style={{ marginBottom: '4px' }}
                    >
                        <input
                            type="text"
                            placeholder="Search..."
                            className="scope-form-control"
                            name="searchword"
                            onChange={searchKeyword}
                            value={keyword}
                            onKeyDown={enter}
                        />
                        <button
                            type="button"
                            className="searchBtn"
                            onClick={handleSubmit}
                        >
                            Search
                        </button>
                    </div>
                    {loading && (
                        <Box
                            className="centered"
                            sx={{ height: 40, marginY: '30%' }}
                        >
                            <Fade
                                in={loading}
                                style={{
                                    transitionDelay: loading ? '800ms' : '0ms',
                                }}
                                unmountOnExit
                            >
                                <CircularProgress color="secondary" />
                            </Fade>
                        </Box>
                    )}
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 380,
                            bgcolor: 'background.paper',
                        }}
                    >
                        <List component="nav" aria-label="main mailbox folders">
                            {!loading &&
                                searchInfo.map((info) => {
                                    console.log(info);
                                    return (
                                        <ListItemButton
                                            key={info.id}
                                            onClick={() => {
                                                redirection(info);
                                            }}
                                        >
                                            <ListItemIcon>
                                                {whatIcon(info.model)}
                                            </ListItemIcon>
                                            <ListItemText
                                                style={{
                                                    fontFamily:
                                                        'Poppins-Regular',
                                                }}
                                                primary={info.title}
                                                secondary={info.model}
                                            />
                                        </ListItemButton>
                                    );
                                })}
                            {!loading && searchInfo[0].id === 0 && (
                                <p className="centered">
                                    Element{' '}
                                    <span
                                        style={{
                                            color: '#7c44f3',
                                            fontFamily: 'Poppins-Bold',
                                        }}
                                    >
                                        {keyword}
                                    </span>{' '}
                                    not foud
                                </p>
                            )}
                        </List>
                    </Box>
                    <SecondaryButton
                        className="centered"
                        variant="outlined"
                        onClick={exit}
                    >
                        Cancel
                    </SecondaryButton>
                </div>
            </div>
        </div>
    );
}

export default function TopBar() {
    const navigate = useNavigate();
    const role = getCookiePart(Cookies.get('Token')!, 'role')?.toString();
    const [isOpen, setIsOpen] = useState(false);
    const [userInfos, setUserInfos] = useState({
        username: '',
        profileImage: '',
        first_name: '',
        last_name: '',
    });

    const goProfile = () => {
        navigate('/profile');
    };

    const getUserInfos = async () => {
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
        const response = await axios.get(
            `${url}/${getCookiePart(Cookies.get('Token')!, 'id')}`,
            {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            }
        );

        const userData = response.data.auth;
        setUserInfos({
            username: userData.username,
            profileImage: userData.profile_image,
            first_name: userData.first_name,
            last_name: userData.last_name,
        });
    };

    const modalClick = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        getUserInfos();
    }, []); // Effect will run once when the component mounts

    return (
        <div className="top-bar">
            <div className="mission-input-block">
                <div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="scope-form-control"
                        name="searchword"
                        readOnly
                        onClick={() => {
                            setIsOpen(true);
                        }}
                    />
                </div>
            </div>
            <div className="btn-left">
                {userInfos.first_name && userInfos.last_name ? (
                    <span className="username">
                        {userInfos.first_name} {userInfos.last_name}
                    </span>
                ) : (
                    <span className="username">{userInfos.username}</span>
                )}
                <span
                    className="btn-profile"
                    onClick={goProfile}
                    role="presentation"
                >
                    {userInfos.profileImage ? (
                        <img
                            src={userInfos.profileImage}
                            alt="Profile"
                            className="profile-image"
                            style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <FaIcons.FaUserCircle size="24px" color="#8A8A8A" />
                    )}
                </span>
            </div>
            {isOpen && <SearchModal exit={modalClick} />}
        </div>
    );
}

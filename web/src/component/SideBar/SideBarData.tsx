import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io';
import config from '../../config';
import { getCookiePart } from '../../crypto-utils';

const SideBarData = function SideBarDataF() {
    const [id, setId] = useState(0);
    const role = getCookiePart(Cookies.get('Token')!, 'role')?.toString();
    const [tab, setTab] = useState<
        { path: string; title: string; idNav: string }[]
    >([]);
    const [userInfo, setUserInfo] = useState({
        favorites: '',
    });

    const getMissionInfo = async (idMission: string) => {
        let name = '';
        await axios
            .get(`${config.apiUrl}/mission/${Number(idMission)}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                name = data.data.title;
            })
            .catch((e) => {
                throw e;
            });
        return name;
    };

    const getUserInfo = async () => {
        let url = `${config.apiUrl}/`;
        if (role === '2') {
            url += 'manager';
        } else if (role === '3') {
            url += 'freelancer';
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
                setUserInfo(data.data.auth);
            })
            .catch((e) => {
                throw e;
            });
    };

    const getMissionFav = async () => {
        const favID = userInfo.favorites;
        const arr: { path: string; title: string; idNav: string }[] = [];
        if (favID) {
            for (let i = 0; i < favID!.length; i += 1) {
                const name = await getMissionInfo(favID[i]);
                arr.push({
                    path: `/mission/detail`,
                    title: name,
                    idNav: favID[i],
                });
            }
        }
        setTab(arr);
        return tab;
    };

    useEffect(() => {
        setId(Number(getCookiePart(Cookies.get('Token')!, 'id')));
    }, []);

    useEffect(() => {
        getUserInfo();
    }, [id]);

    useEffect(() => {
        const getData = async () => {
            await getMissionFav();
        };
        getData();
    }, [userInfo.favorites]);
    const isFreelancer = role === '3'; // Vérification du rôle de freelanceur

    return [
        {
            title: 'Create a Mission',
            path: '/mission/create', // change when build client page
            icon: <AiIcons.AiOutlineStar color="#7c44f3" />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: true,
            subNav: [],
        },
        {
            title: 'Create a team',
            path: '/team/create', // change when build client page
            icon: <BsIcons.BsPeople color="#7c44f3" />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: true,
            subNav: [],
        },
        {
            title: 'Dashboard',
            path: '/accueil',
            icon: <AiIcons.AiOutlineHome color="#7c44f3" />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: false,
            subNav: [],
        },
        {
            title: 'Missions',
            path: '/dashboard', // change when build client page
            icon: <BsIcons.BsJournals color="#7c44f3" />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: false,
            subNav: tab,
        },
        {
            title: 'Teams',
            path: '/team', // change when build client page
            icon: <AiIcons.AiOutlineTeam color="#7c44f3" />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: false,
            subNav: [],
        },
        {
            title: 'Clients',
            path: '/client', // change when build client page
            icon: <IoIcons.IoMdPeople color="#7c44f3" />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: true,
            subNav: [],
        },
    ].filter(
        (item) =>
            !(item.title === 'Create a team' || item.title === 'Teams') ||
            !isFreelancer
    );
};

export default SideBarData;

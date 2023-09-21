import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io';
import config from '../../config';

const SideBarData = function SideBarDataF() {
    const [id, setId] = useState(0);
    const role = Cookies.get('Role');
    const [tab, setTab] = useState<
        { path: string; title: string; idNav: string }[]
    >([]);
    const [favList, setList] = useState<string>();
    const [userInfo, setUserInfo] = useState({
        favorites: '',
    });

    const getMissionInfo = async (idMission: string) => {
        let name = '';
        await axios
            .get(`${config.apiUrl}/mission/${Number(idMission)}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
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
        if (role === '2') url += 'manager';
        else url += 'pentester';
        await axios
            .get(`${url}/${Cookies.get('Id')}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
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
        setId(Number(Cookies.get('Id')));
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

    return [
        // {
        //     title: 'Dashboard',
        //     path: '/dashboard',
        //     icon: <AiIcons.AiOutlineHome />,
        //     iconClosed: <IoIcons.IoIosArrowForward />,
        //     iconOpened: <IoIcons.IoIosArrowDown />,
        //     subNav: [
        //         {
        //             title: 'List item',
        //             path: '/dashboard', // can be changed later
        //         },
        //     ],
        // },
        {
            title: 'Create a Mission',
            path: '/mission/create', // change when build client page
            icon: <AiIcons.AiOutlineStar />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: true,
            subNav: [],
        },
        {
            title: 'Create a team',
            path: '/team/create', // change when build client page
            icon: <BsIcons.BsPeople />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: true,
            subNav: [],
        },
        {
            title: 'Missions',
            path: '/dashboard', // change when build client page
            icon: <BsIcons.BsJournals />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: false,
            subNav: tab,
        },
        {
            title: 'Teams',
            path: '/team', // change when build client page
            icon: <BsIcons.BsJournals />,
            iconClosed: <IoIcons.IoIosArrowForward />,
            iconOpened: <IoIcons.IoIosArrowDown />,
            isForManager: false,
            subNav: [],
        },
    ];
};

export default SideBarData;

import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io';
import config from '../../config';

export const SideBarData = function SideBarDataF() {
    const [tab, setTab] = useState<{ path: string; title: string; idNav : string }[]>([]);
    const [favList, setList] = useState<string>();

    const getMissionInfo = async (id : string) => {
        let name = '';
        await axios
                .get(`${config.apiUrl}/mission/${Number(id)}`, {
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
    }
    
    const getMissionFav = async () => {
        const favID = favList?.split('/');
        const arr: { path: string; title: string; idNav : string }[] = [];
        if (favID) {
            favID!.pop();
            for (let i = 0; i < favID!.length; i++) {
                let name = await getMissionInfo(favID[i]);
                arr.push({path : `/mission/detail`, title : name, idNav : favID[i]});
            }
                    }
        setTab(arr)
        return tab;
    }

    useEffect(() => {
        setList(Cookies.get('Fav'))
    }, []);

    useEffect(() => {
    const getData = async () => {
        await getMissionFav()
    }
        getData()
    }, [favList]);

    return  [
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
                path: '.', // change when build client page
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
}
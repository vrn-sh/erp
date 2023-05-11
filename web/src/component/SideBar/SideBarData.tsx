import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io';

const SideBarData = [
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
        subNav: [],
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

export default SideBarData;

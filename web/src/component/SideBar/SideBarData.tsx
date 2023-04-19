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
        title: 'Missions',
        path: '/dashboard', // change when build client page
        icon: <AiIcons.AiOutlineStar />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [],
    },
    {
        title: 'Create a team',
        path: '/dashboard', // change when build client page
        icon: <BsIcons.BsPeople />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [],
    },
];

export default SideBarData;

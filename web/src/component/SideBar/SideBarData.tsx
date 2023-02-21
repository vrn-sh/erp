import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as TbIcons from 'react-icons/tb';
import * as RiIcons from 'react-icons/ri';
import * as IoIcons from 'react-icons/io';

export const SideBarData = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <AiIcons.AiOutlineHome />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [
            {
                title: 'List item',
                path: '/dashboard', // can be changed later
            },
        ],
    },
    {
        title: 'Client',
        path: '/dashboard', // change when build client page
        icon: <BsIcons.BsPeople />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [
            {
                title: 'List item',
                path: '/dashboard', // can be changed later
            },
        ],
    },
    {
        title: 'Hosts',
        path: '/dashboard', // change when build client page
        icon: <RiIcons.RiFileList2Line />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [
            {
                title: 'List item',
                path: '/dashboard', // can be changed later
            },
        ],
    },
    {
        title: 'Impacts',
        path: '/dashboard', // change when build client page
        icon: <AiIcons.AiOutlineInbox />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [],
    },
    {
        title: 'Missions',
        path: '/dashboard', // change when build client page
        icon: <AiIcons.AiOutlineStar />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [],
    },
    {
        title: 'Users',
        path: '/dashboard', // change when build client page
        icon: <RiIcons.RiShieldUserLine />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [],
    },
    {
        title: 'Vulnerabilities',
        path: '/dashboard', // change when build client page
        icon: <TbIcons.TbTarget />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [],
    },
];

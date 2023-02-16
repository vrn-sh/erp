import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as GrIcons from 'react-icons/gr';
import * as TbIcons from 'react-icons/tb';
import * as RiIcons from 'react-icons/ri';
import * as IoIcons from 'react-icons/io';

export const SideBarData = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <AiIcons.AiFillHome />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [
            {
                title: "List item",
                path: "/dashboard", //can be changed later
            }
        ]
    },
    {
        title: "Client",
        path: "/dashboard", //change when build client page
        icon: <BsIcons.BsPeopleFill />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [
            {
                title: "List item",
                path: "/dashboard", //can be changed later
            }
        ]
    },
    {
        title: "Hosts",
        path: "/dashboard", //change when build client page
        icon: <GrIcons.GrHostMaintenance />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
        subNav: [
            {
                title: "List item",
                path: "/dashboard", //can be changed later
            }
        ]
    },
    {
        title: "Impacts",
        path: "/dashboard", //change when build client page
        icon: <GrIcons.GrThreeDEffects />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
    },
    {
        title: "Missions",
        path: "/dashboard", //change when build client page
        icon: <AiIcons.AiFillStar />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
    },
    {
        title: "Users",
        path: "/dashboard", //change when build client page
        icon: <RiIcons.RiShieldUserFill />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
    },
    {
        title: "Vulnerabilities",
        path: "/dashboard", //change when build client page
        icon: <TbIcons.TbTarget />,
        iconClosed: <IoIcons.IoIosArrowForward />,
        iconOpened: <IoIcons.IoIosArrowDown />,
    },
]
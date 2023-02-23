import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import './SideBar.scss';
import * as FiIcons from 'react-icons/fi';
// import SubMenu from './SubMenu';
import SideBarData from './SideBarData';

interface CardItem {
    item: ItemProps;
}

interface ItemProps {
    path: string;
    title: string;
    icon: ReactNode;
    subNav: {
        path: string;
        title: string;
    }[];
    iconOpened: ReactNode;
    iconClosed: ReactNode;
}

const SubMenuItem: React.FC<CardItem> = function SubMenu({ item }) {
    const [subnav, setSubnav] = useState(false);
    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <Link
                to={item.path}
                className="sidebar-link"
                onClick={item.subNav && showSubnav}
            >
                <div className="sidebar-item">
                    {item.icon}
                    <span className="menu-txt">{item.title}</span>
                </div>
                <div>
                    {(() => {
                        if (item.subNav.length > 0) {
                            if (subnav) return item.iconOpened;
                            return item.iconClosed;
                        }
                        return null;
                    })()}
                </div>
            </Link>
            {subnav &&
                item.subNav.map((subItem) => {
                    return (
                        <Link to={subItem.path} className="dropdown-menu">
                            <p>{subItem.title}</p>
                        </Link>
                    );
                })}
        </>
    );
};

export default function SideBar() {
    return (
        <div className="sidebar">
            <Link to="/dashboard">
                <h1 className="site-title">voron</h1>
            </Link>
            <div className="sidebar-container">
                {SideBarData.map((item) => {
                    return <SubMenuItem item={item} />;
                })}
            </div>

            <div className="sidebar-tool">
                <Link to="/dashboard" className="sidebar-link">
                    <div className="sidebar-item">
                        <FiIcons.FiSettings />
                        <span className="menu-txt">Settings</span>
                    </div>
                </Link>
                <Link to="/dashboard" className="sidebar-link">
                    <div className="sidebar-item">
                        <FiIcons.FiLogOut />
                        <span className="menu-txt">Disconnect</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}

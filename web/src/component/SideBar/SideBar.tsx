import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './SideBar.scss';
import { SideBarData } from './SideBarData';
import SubMenu from './SubMenu';
import * as FiIcons from 'react-icons/fi';

type itemProps = {
    path: string;
    title: string;
    icon: ReactNode;
    subNav:
    {
        path: string;
        title: string;
    }[];
    iconOpened: ReactNode;
    iconClosed: ReactNode;
};

export default function SideBar() {
    return (
        <div className="sidebar">
            <Link to="/dashboard">
                <h1 className="site-title">voron</h1>
            </Link>
            <div className="sidebar-container">
                {SideBarData.map((item: itemProps) => {
                    return <SubMenu {...item} />
                })};
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
    )
};

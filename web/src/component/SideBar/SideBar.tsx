import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SideBar.scss';
import * as FiIcons from 'react-icons/fi';
// import axios from 'axios';
import SideBarData from './SideBarData';
import { ICardItem } from './SideBarMenu.type';
import config from '../../config';

const SubMenuItem: React.FC<ICardItem> = function SubMenu({ item }) {
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
                        <Link
                            key={subItem.title}
                            to={subItem.path}
                            className="dropdown-menu"
                        >
                            <p>{subItem.title}</p>
                        </Link>
                    );
                })}
        </>
    );
};

export default function SideBar() {
    const navigate = useNavigate();
    const t = localStorage.getItem('token');
    const headers = { Authorization: `Token ${t}` };
    // const logout = async () => {
    //     try {
    //         await axios
    //             .get(`${config.apiUrl}/logout`, { headers })
    //             .then(() => {
    //                 localStorage.removeItem('token');
    //                 navigate('/');
    //                 console.log('ok');
    //             })
    //             .catch(() => {});
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    return (
        <div className="sidebar">
            <Link to="/dashboard">
                <h1 className="site-title">voron</h1>
            </Link>
            <div>
                {SideBarData.map((item) => {
                    return <SubMenuItem key={item.title} item={item} />;
                })}
            </div>

            <div className="sidebar-tool">
                <Link to="/settings" className="sidebar-link-bottom">
                    <div className="sidebar-item">
                        <FiIcons.FiSettings />
                        <span className="menu-txt">Settings</span>
                    </div>
                </Link>
                <div className="sidebar-link-bottom">
                    <div className="sidebar-item">
                        <FiIcons.FiLogOut />
                        <span className="menu-txt">Disconnect</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

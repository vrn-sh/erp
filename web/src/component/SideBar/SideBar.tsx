import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SideBar.scss';
import * as FiIcons from 'react-icons/fi';
import axios from 'axios';
import Cookies from 'js-cookie';
import SideBarData from './SideBarData';
import { ICardItem, ISideBarMenu } from './SideBarMenu.type';
import config from '../../config';
import icon from '../../assets/voron-logo.svg';
import { getCookiePart } from '../../crypto-utils';

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
                            key={subItem.idNav}
                            to={subItem.path}
                            state={{ missionId: subItem.idNav }}
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
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';

    const logout = async () => {
        await axios(`${config.apiUrl}/logout`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${getCookiePart(
                    Cookies.get('Token')!,
                    'token'
                )}`,
            },
        })
            .then(() => {
                Cookies.remove('Token', { path: '/dashboard' });
                Cookies.remove('Role', { path: '/dashboard' });
                navigate('/');
            })
            .catch((e) => {
                throw e;
            });
    };

    const data = SideBarData();

    return (
        <div className="sidebar">
            <Link to="/accueil" className="sidebar-logo">
                <img src={icon} alt="icon" className="nav-logo" />
                <h1 className="sidebar-site-title">voron</h1>
            </Link>
            <div>
                {data.map((item: ISideBarMenu, index: number) => {
                    if (isPentester) {
                        if (index > 1 && index < data.length - 1) {
                            return <SubMenuItem key={item.title} item={item} />;
                        }
                    } else return <SubMenuItem key={item.title} item={item} />;
                    return null;
                })}
            </div>

            <div className="sidebar-tool">
                <Link to="/settings" className="sidebar-link-bottom">
                    <div className="sidebar-item">
                        <FiIcons.FiSettings color="#7c44f3" />
                        <span className="menu-txt">Settings</span>
                    </div>
                </Link>
                <div className="sidebar-link-bottom">
                    <div className="sidebar-item">
                        <FiIcons.FiLogOut />
                        <span
                            role="presentation"
                            className="menu-txt"
                            onClick={logout}
                        >
                            Disconnect
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import './SideBar.scss';

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

const SubMenu: React.FC<ItemProps> = (item) => {
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
                    {item.subNav.length > 0
                        ? subnav
                            ? item.iconOpened
                            : item.iconClosed
                        : null}
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

export default SubMenu;

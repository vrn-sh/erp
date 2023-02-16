import { useState } from 'react'
import { Link } from 'react-router-dom'
import "./SideBar.scss"

const SubMenu = ({ item }) => {
    const [ subnav, setSubnav ] = useState(false)
    const showSubnav = () => setSubnav(!subnav)

    return (
        <>
            <Link to={item.path} className="sidebar-link" onClick={item.subNav && showSubnav}>
                <div className='sidebar-item'>
                    {item.icon}
                    <span className='menu-txt'>{item.title}</span>
                </div>
                <div>
                    {item.subNav && subnav 
                    ? item.iconOpened 
                    : item.subNav 
                    ? item.iconClosed 
                    : null}
                </div>
            </Link>
            {subnav && item.subNav.map((subItem, subIndex) => {
                return (
                    <Link to={subItem.path} key={subIndex} className='dropdown-menu'>
                        <p>{subItem.title}</p>
                    </Link>
                )
            })}
        </>
    )
};

export default SubMenu;
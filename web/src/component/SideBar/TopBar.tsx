import React from 'react';
import './SideBar.scss';
import * as BiIcons from 'react-icons/bi';
import * as FaIcons from 'react-icons/fa';

export default function TopBar() {
    return (
        <div className="top-bar">
            <div className="topBar-wrapper">
                <div className="topBar-searchIcon">
                    <BiIcons.BiSearch color="#8A8A8A" />
                </div>
                <input
                    className="topBar-input"
                    type="text"
                    placeholder="Search"
                />
            </div>
            <div className="btn-left">
                <span className="btn">
                    <FaIcons.FaBell size="22px" color="#8A8A8A" />
                </span>
                <span className="btn-profile">
                    <FaIcons.FaUserCircle size="22px" color="#8A8A8A" />
                </span>
            </div>
        </div>
    );
}

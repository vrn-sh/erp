import React, { useState } from 'react';
import './SideBar.scss';
import * as BiIcons from 'react-icons/bi';
import * as FaIcons from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function TopBar() {
    const [popup, setPopup] = useState(false);
    const navigate = useNavigate();
    // const isPentester = Cookies.get('Role') === '1';

    const popupClick = () => {
        setPopup(!popup);
    };

    const handleKeydown = () => {};

    const goProfile = () => {
        navigate('/settings');
    };

    return (
        <div className="top-bar">
            <div className="topBar-wrapper">
                <div className="topBar-searchIcon">
                    <BiIcons.BiSearch color="#8A8A8A" />
                </div>
                {/* <input
                    className="topBar-input"
                    type="text"
                    placeholder="Search"
                /> */}
            </div>
            <div className="btn-left">
                {/* {!isPentester && (
                    <input
                        type="button"
                        value="Add pentester"
                        className="borderBtn"
                        onClick={popupClick}
                    />
                )} */}
                <span className="btn">
                    <FaIcons.FaBell size="22px" color="#8A8A8A" />
                </span>
                {/* <span
                    className="btn-profile"
                    onClick={goProfile}
                    onKeyDown={handleKeydown}
                    role="presentation"
                >
                    <FaIcons.FaUserCircle size="22px" color="#8A8A8A" />
                </span> */}
            </div>
        </div>
    );
}

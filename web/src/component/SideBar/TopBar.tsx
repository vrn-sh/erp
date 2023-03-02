import React, { useState } from 'react';
import './SideBar.scss';
import * as BiIcons from 'react-icons/bi';
import * as FaIcons from 'react-icons/fa';

export default function TopBar() {
    const [popup, setPopup] = useState(false);

    const popupClick = () => {
        setPopup(!popup);
    };

    return (
        <>
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
                    <input
                        type="button"
                        value="Add pentester"
                        className="borderBtn"
                        onClick={popupClick}
                    />
                    <span className="btn">
                        <FaIcons.FaBell size="22px" color="#8A8A8A" />
                    </span>
                    <span className="btn-profile">
                        <FaIcons.FaUserCircle size="22px" color="#8A8A8A" />
                    </span>
                </div>
            </div>

            {popup && (
                <div className="popup">
                    <div className="popup-overlay">
                        <h1>Invite a pentester</h1>
                        <input
                            type="text"
                            placeholder="Email"
                            className="popup-input"
                        />
                        <button type="button" className="sendBtn">
                            Send invitation
                        </button>
                        <button
                            type="button"
                            className="sendBtn"
                            onClick={popupClick}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

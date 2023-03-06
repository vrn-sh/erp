import React, { useState } from 'react';
import './SideBar.scss';
import * as BiIcons from 'react-icons/bi';
import * as FaIcons from 'react-icons/fa';

export default function TopBar() {
    const [popup, setPopup] = useState(false);
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setErrorEmail('Please enter valid email address.');
        } else if (/^\S+@\S+\.\S+$/.test(email)) {
            setErrorEmail('');
        }
    };

    const popupClick = () => {
        setPopup(!popup);
    };

    const sendInvitation = () => {
        if (email !== '' && errorEmail === '') {
            // send API here
            popupClick();
        }
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
                            type="email"
                            placeholder="Email"
                            className="popup-input"
                            onChange={checkEmail}
                        />
                        <p className="error">{errorEmail}</p>
                        <button
                            type="button"
                            className="sendBtn"
                            onClick={sendInvitation}
                        >
                            Send invitation
                        </button>
                        <button
                            type="button"
                            className="cancelBtn"
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

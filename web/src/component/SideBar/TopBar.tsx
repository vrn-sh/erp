import React from 'react';
import './SideBar.scss';
import * as FaIcons from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
    const navigate = useNavigate();
    const handleKeydown = () => {};

    const goProfile = () => {
        navigate('/settings');
    };

    return (
        <div className="top-bar">
            <div className="btn-left">
                <span
                    className="btn-profile"
                    onClick={goProfile}
                    onKeyDown={handleKeydown}
                    role="presentation"
                >
                    <FaIcons.FaUserCircle size="22px" color="#8A8A8A" />
                </span>
            </div>
        </div>
    );
}

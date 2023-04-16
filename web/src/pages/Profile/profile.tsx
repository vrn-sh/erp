import './profile.scss';
import React, { Component } from 'react';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';

export default function ProfilePage() {
    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
            </div>
        </div>
    );
}

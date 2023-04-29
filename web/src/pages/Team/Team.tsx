import React from 'react';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import TeamList from './TeamList';
import '../Dashboard/Dashboard.scss';

export default function Team() {
    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <TeamList />
            </div>
        </div>
    );
}

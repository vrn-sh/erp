import React from 'react';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import './Dashboard.scss';
import Accueil from './Accueil';
import SubDashboard from './SubDashboard';

export default function Dashboard() {
    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                {/* <Accueil /> */}
                <SubDashboard />
            </div>
        </div>
    );
}

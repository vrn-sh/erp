import React, { useState } from 'react';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import './Dashboard.scss';
import SubDashboard from './SubDashboard';

export default function Dashboard() {
    const [burger, setBurger] = useState(false);

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <SubDashboard />
            </div>
        </div>
    );
}

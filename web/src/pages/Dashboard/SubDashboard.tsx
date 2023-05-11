import React from 'react';
import './Dashboard.scss';
import DashboardMission from './DashboardMission';

export default function SubDashboard() {
    return (
        <div className="dashboard-pages">
            <div className="page-info">
                <h1>Welcome to your dashboard</h1>
            </div>

            <div className="assigned-missions">
                <DashboardMission />
            </div>
        </div>
    );
}

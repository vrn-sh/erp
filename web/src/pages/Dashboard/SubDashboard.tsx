import React from 'react';
import './Dashboard.scss';
import DashboardMission from './DashboardMission';

export default function SubDashboard() {
    return (
        <div className="dashboard-pages">
            <div className="assigned-missions">
                <DashboardMission />
            </div>
        </div>
    );
}

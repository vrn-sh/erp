import React, { useState } from 'react';
import * as MdIcons from 'react-icons/md';
import {
    IDashboardMission,
    DashboardMissionList,
} from './DashboardMission.type';
import './Dashboard.scss';
import DashboardMission from './DashboardMission';

export default function SubDashboard() {
    const [missionList] = useState(DashboardMissionList as IDashboardMission[]);

    return (
        <div className="dashboard-pages">
            <div className="page-info">
                <div className="page-loca">
                    <p>
                        Voron
                        <span>
                            <MdIcons.MdKeyboardArrowRight />
                        </span>
                    </p>
                    <h1>Welcome to your dashboard</h1>
                </div>
                <div className="page-searcher">
                    <label>Search on page</label>
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            <div className="assigned-missions">
                <DashboardMission list={missionList} />
            </div>
        </div>
    );
}

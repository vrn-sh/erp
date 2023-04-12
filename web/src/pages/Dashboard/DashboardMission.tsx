import React, { useState } from 'react';
import './Dashboard.scss';
import DorkEngine from './SubDashboards/DorkEngine';
import Mission from './SubDashboards/Mission';
import Notes from './SubDashboards/Notes';

function DashboardMission() {
    const [active, setActive] = useState('main');

    const handleClick = (event: any) => {
        setActive(event.target.id);
    };

    const getSubDashboard = () => {
        if (active === 'main') {
            return <Mission />;
        }
        if (active === 'dork') {
            return <DorkEngine />;
        }
        if( active === 'note') {
            return <Notes/>;
        }
        return null;
    };

    // const updatePercent = (n: number) => {
    //     setFinish(n);
    // }; // need to add setFinish on line 12

    return (
        <div className="dashboard-table">
            <h1>Assigned missions</h1>
            <div className="dashboard-content">
                <div className="subHeader">
                    <button
                        key={1}
                        id="main"
                        type="button"
                        className={active === 'main' ? 'active' : undefined}
                        onClick={handleClick}
                    >
                        Main
                    </button>
                    <button
                        key={2}
                        id="note"
                        type="button"
                        className={active === 'note' ? 'active' : undefined}
                        onClick={handleClick}
                    >
                        Note
                    </button>
                    <button
                        key={3}
                        id="vuln"
                        type="button"
                        className={active === 'vuln' ? 'active' : undefined}
                        onClick={handleClick}
                    >
                        Vulnerability
                    </button>
                    <button
                        key={2}
                        id="dork"
                        type="button"
                        className={active === 'dork' ? 'active' : undefined}
                        onClick={handleClick}
                    >
                        Dork Engine
                    </button>
                </div>
                {getSubDashboard()}
            </div>
        </div>
    );
}

export default DashboardMission;

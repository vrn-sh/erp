import React, { useState } from 'react';
import './Dashboard.scss';
import DorkEngine from './SubDashboards/DorkEngine';
import Mission from './SubDashboards/Mission';
import CrtSh from './SubDashboards/CrtSh';

function MissionSubMenu(props: any) {
    const tmp = props;

    return (
        <button
            key={tmp.key_p}
            id={tmp.id_p}
            type="button"
            className={tmp.active === tmp.id_p ? 'active' : undefined}
            onClick={tmp.handleClick}
        >
            {tmp.title}
        </button>
    );
}

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
        if (active === 'crt') {
            return <CrtSh />;
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
                    <MissionSubMenu
                        key_p="1"
                        id_p="main"
                        active={active}
                        handleClick={handleClick}
                        title="Main"
                    />
                    <MissionSubMenu
                        key_p="2"
                        id_p="note"
                        active={active}
                        handleClick={handleClick}
                        title="Note"
                    />
                    <MissionSubMenu
                        key_p="3"
                        id_p="vuln"
                        active={active}
                        handleClick={handleClick}
                        title="Vulnerability"
                    />
                    <MissionSubMenu
                        key_p="4"
                        id_p="dork"
                        active={active}
                        handleClick={handleClick}
                        title="Dork Engine"
                    />
                    <MissionSubMenu
                        key_p="5"
                        id_p="crt"
                        active={active}
                        handleClick={handleClick}
                        title="crt.sh"
                    />
                </div>
                {getSubDashboard()}
            </div>
        </div>
    );
}

export default DashboardMission;

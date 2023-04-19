import React, { useState } from 'react';
import SideBar from '../../../../component/SideBar/SideBar';
import TopBar from '../../../../component/SideBar/TopBar';
import '../../Dashboard.scss';
import './MissionDetail.scss';
import Scope from './Scope';

export default function MissionDetail() {
    const [active, setActive] = useState('scope');

    const handleClick = (event: any) => {
        setActive(event.target.id);
    };

    const getSubMissionDetail = () => {
        if (active === 'scope') {
            return <Scope />;
        }
        if (active === 'recon') {
            // return <>;
        }
        return null;
    };

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="mission-detail-container">
                    <h1>Fame mission web</h1>
                    <p>Additional description if required</p>

                    <div className="subHeader">
                        <div className="submenu-mission">
                            <button
                                key={1}
                                id="scope"
                                type="button"
                                className={
                                    active === 'scope' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Scope
                            </button>
                            <button
                                key={2}
                                id="recon"
                                type="button"
                                className={
                                    active === 'recon' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Recon
                            </button>
                        </div>
                    </div>
                    {getSubMissionDetail()}
                </div>
            </div>
        </div>
    );
}

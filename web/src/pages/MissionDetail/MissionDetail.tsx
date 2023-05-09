import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import Scope from './Scope';
import Recon from './Recon';

export default function MissionDetail() {
    const [active, setActive] = useState('scope');
    const [id, setId] = useState(0);
    const location = useLocation();

    const handleClick = (event: any) => {
        setActive(event.target.id);
    };

    useEffect(() => {
        setId(location.state.missionId);
    }, []);

    const getSubMissionDetail = () => {
        if (active === 'scope') {
            return <Scope />;
        }
        if (active === 'recon') {
            return <Recon id={id} />;
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

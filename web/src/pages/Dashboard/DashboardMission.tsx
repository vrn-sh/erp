import React, { useState } from 'react';
import './Dashboard.scss';
import { IDashboardMission } from './DashboardMission.type';

type Props = {
    list: IDashboardMission[];
};

function DashboardMission(props: Props) {
    const { list } = props;
    const [active, setActive] = useState('1');
    const [finish] = useState(50);

    const handleClick = (event: any) => {
        setActive(event.target.id);
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
                        id="1"
                        type="button"
                        className={active === '1' ? 'active' : undefined}
                        onClick={handleClick}
                    >
                        My Mission
                    </button>
                    <button
                        key={2}
                        id="2"
                        type="button"
                        className={active === '2' ? 'active' : undefined}
                        onClick={handleClick}
                    >
                        My Roles
                    </button>
                </div>
                <table>
                    {list.map((mission) => {
                        return (
                            <tr key={mission.id}>
                                <td>{mission.name}</td>
                                <td>{mission.type}</td>
                                <td>
                                    <input
                                        type="button"
                                        value="Open"
                                        className="openBtn"
                                    />
                                    <input
                                        type="button"
                                        value="Edit"
                                        className="borderBtn"
                                    />
                                </td>
                                {/* Process bar */}
                                <td>
                                    <div className="process-td">
                                        <div className="process-bar">
                                            <div
                                                className="process-container"
                                                style={{
                                                    width: `${finish}%`,
                                                    transition: 'width 0.5s',
                                                }}
                                            />
                                        </div>
                                        <span className="process-percent">
                                            {finish}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        </div>
    );
}

export default DashboardMission;

import React, { useState } from 'react';
import './Dashboard.scss';
import { IDashboardMission } from './DashboardMission.type';

type Props = {
    list: IDashboardMission[];
};

function DashboardMission(props: Props) {
    const { list } = props;
    const [active, setActive] = useState('');

    const handleClick = (event: any) => {
        setActive(event.target.id);
    };

    return (
        <div className="dashboard-table">
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
                                    className="editBtn"
                                />
                            </td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
}

export default DashboardMission;

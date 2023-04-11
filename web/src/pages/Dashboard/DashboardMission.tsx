import React, { useState } from 'react';
import './Dashboard.scss';
import DorkEngine from './SubDashboards/DorkEngine';
import Mission from './SubDashboards/Mission';

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
                {active === 'mission' ? (
                    <>
                        <table>
                            {records.map((mission) => {
                                return (
                                    <tbody key={mission.id}>
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
                                                                width: getwidth(
                                                                    mission.percent
                                                                ),
                                                                transition:
                                                                    'width 0.5s',
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="process-percent">
                                                        {mission.percent}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                );
                            })}
                        </table>
                        <nav>
                            <ul className="pagination">
                                <li className="page-item">
                                    <a
                                        href="#"
                                        className="page-link"
                                        onClick={prePage}
                                    >
                                        <IoIcons.IoIosArrowBack />
                                    </a>
                                </li>
                                {nums.map((n) => {
                                    return (
                                        <li
                                            key={n}
                                            className={`page-item ${
                                                currentPage === n
                                                    ? 'active'
                                                    : ''
                                            }`}
                                        >
                                            <a
                                                href="#"
                                                className="page-link"
                                                onClick={() => changePage(n)}
                                            >
                                                {n}
                                            </a>
                                        </li>
                                    );
                                })}
                                <li className="page-item">
                                    <a
                                        href="#"
                                        className="page-link"
                                        onClick={nextPage}
                                    >
                                        <IoIcons.IoIosArrowForward />
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default DashboardMission;

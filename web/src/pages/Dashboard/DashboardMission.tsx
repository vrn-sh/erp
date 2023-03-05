import React, { useState } from 'react';
import './Dashboard.scss';
import * as IoIcons from 'react-icons/io';
import { IDashboardMission } from './DashboardMission.type';

type Props = {
    list: IDashboardMission[];
};

function DashboardMission(props: Props) {
    const { list } = props;
    const [active, setActive] = useState('1');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 3;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = list.slice(firstIndex, lastIndex);
    const npage = Math.ceil(list.length / recordsPerPage);
    const nums = [...Array(npage + 1).keys()].slice(1);

    const nextPage = () => {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prePage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const changePage = (n: number) => {
        setCurrentPage(n);
    };

    const handleClick = (event: any) => {
        setActive(event.target.id);
    };

    const getwidth = (n: number) => {
        return `${n.toString()}%`;
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
                    {records.map((mission) => {
                        return (
                            <tbody>
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
                            <a href="#" className="page-link" onClick={prePage}>
                                <IoIcons.IoIosArrowBack />
                            </a>
                        </li>
                        {nums.map((n) => {
                            return (
                                <li
                                    className={`page-item ${
                                        currentPage === n ? 'active' : ''
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
            </div>
        </div>
    );
}

export default DashboardMission;

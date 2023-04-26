import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as IoIcons from 'react-icons/io';
import {
    IDashboardMission,
    DashboardMissionList,
} from '../DashboardMission.type';
import '../Dashboard.scss';
import axios from 'axios';

export default function Mission() {
    const [list] = useState(DashboardMissionList as IDashboardMission[]);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = list.slice(firstIndex, lastIndex);
    const npage = Math.ceil(list.length / recordsPerPage);
    const nums = [...Array(npage + 1).keys()].slice(1);
    const navigate = useNavigate();

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

    const getMission = async () => {
        try {
            await axios
                .get(`http://localhost:8080/mission/`)
                .then((data) => {
                    data;
                })
                .catch((e) => {
                    throw e.message
                });
        } catch (error) {
            throw error;
        }
    };

    const getwidth = (n: number) => {
        return `${n.toString()}%`;
    };

    const NavEditMission = (id : number) => {
        navigate('/mission/edit', {
            state: {
                missionId: id,
              }
          });
    };

    useEffect(() => {
        getMission();
    }, []);

    return (
        <>
            <table className="no_center_container">
                {records.map((mission) => {
                    return (
                        <tbody key={mission.id}>
                            <tr key={mission.id}>
                                <td>{mission.name}</td>
                                <td>{mission.team}</td>
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
                                        onClick={() => NavEditMission(mission.id)}
                                    />
                                </td>
                                {/* Process bar */}
                                {/* <td>
                                    <div className="process-td">
                                        <div className="process-bar">
                                            <div
                                                className="process-container"
                                                style={{
                                                    width: getwidth(
                                                        mission.percent
                                                    ),
                                                    transition: 'width 0.5s',
                                                }}
                                            />
                                        </div>
                                        <span className="process-percent">
                                            {mission.percent}%
                                        </span>
                                    </div>
                                </td> */}
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
                                key={n}
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
                        <a href="#" className="page-link" onClick={nextPage}>
                            <IoIcons.IoIosArrowForward />
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    );
}

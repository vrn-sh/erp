import React, { useState, useEffect } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import config from '../../config';

export default function Scope(/* need to add list as a param here */) {
    const [keyword, setKeyword] = useState('');
    const [scope, setScope] = useState([]);
    const [missionId, setMissionId] = useState();
    const [Title, setTitle] = useState('');
    const [Team, setTeam] = useState(0);
    const [createBy, setCreateBy] = useState();
    const [lastEdit, setLastEdit] = useState();
    const [start, setStart] = useState<Dayjs>(dayjs());
    const [end, setEnd] = useState<Dayjs>(dayjs());

    const isPentester = Cookies.get('Role') === '1';

    const recordsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [record, setRecord] = useState([]);
    const [npage, setNPage] = useState(0);
    const [nums, setNums] = useState<any[]>([]);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;

    const navigate = useNavigate();
    const location = useLocation();

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

    const delScope = async (index: number) => {
        const newScope = scope.filter((s, i) => i !== index);
        await axios
            .patch(
                `${config.apiUrl}/mission/${missionId}`,
                {
                    title: Title,
                    end: end.format('YYYY-MM-DD'),
                    start: start.format('YYYY-MM-DD'),
                    team: Team,
                    scope: newScope,
                    created_by: createBy,
                    last_updated_by: lastEdit,
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${Cookies.get('Token')}`,
                    },
                }
            )
            .then(() => {
                toast.success('Scope deleted!');
                setScope(newScope);
            })
            .catch((e) => {
                toast.error(e.message);
            });
    };

    const getMission = async () => {
        await axios
            .get(`${config.apiUrl}/mission/${missionId}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                setTitle(data.data.title);
                setEnd(dayjs(data.data.end));
                setStart(dayjs(data.data.start));
                setTeam(data.data.team);
                setCreateBy(data.data.created_by);
                setLastEdit(data.data.last_updated_by);
            })
            .catch((e) => {
                throw e;
            });
    };

    // const searchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     event.preventDefault();
    //     setKeyword(event.target.value);
    // };

    // const searchScope = () => {
    //     let find = false;
    //     for (let i = 0; i < scope.length; i += 1) {
    //         if (scope[i].toLowerCase().includes(keyword)) {
    //             const p = Math.floor(scope[i].id / recordsPerPage) + 1;
    //             if (scope[i].id % 3 === 0) changePage(p - 1);
    //             else changePage(p);
    //             find = true;
    //         }
    //         if (find === true) break;
    //     }
    // };

    const NavAddVul = () => {
        navigate('/vuln/add');
    };

    useEffect(() => {
        setMissionId(location.state.missionId);
        setScope(location.state.scopeList);
    }, []);

    useEffect(() => {
        getMission();
        setRecord(scope.slice(firstIndex, lastIndex));
        setNPage(Math.ceil(scope.length / recordsPerPage));
        const n = [...Array(npage + 1).keys()].slice(1);
        setNums(n);
        // searchScope();
    }, [missionId, scope]);

    return (
        <>
            <div>
                <Toaster position="top-center" reverseOrder={false} />
            </div>
            <div className="mission-tool-line">
                {/* <div className="search-name">
                    <div className="mission-input-block">
                        <label
                            className="placeholder"
                            htmlFor="Confirmpassword"
                        >
                            Search by name
                        </label>
                        <input
                            type="text"
                            name="confirmpassword"
                            onChange={searchKeyword}
                        />
                    </div>
                    <button
                        type="button"
                        className="input_btn"
                        onClick={searchScope}
                    >
                        Search
                    </button>
                </div> */}

                <button type="button" className="input_btn mission-borderBtn">
                    GET REPORT
                </button>
            </div>
            <table className="no_center_container">
                <tbody>
                    <tr>
                        {/* <th>Status</th> */}
                        <th className="md-5">Name</th>
                        <th className="md-3">Badges</th>
                        <th className="md-2">Actions</th>
                    </tr>
                    {record.map((s_list, index) => {
                        return (
                            <tr>
                                {/* <td style={{ fontSize: '18px' }}>
                                    {s_list.status ? (
                                        <AiIcons.AiOutlineCheckCircle />
                                    ) : (
                                        <AiIcons.AiOutlineCloseCircle />
                                    )}
                                </td> */}
                                <td id="name">{s_list}</td>
                                <td>
                                    {/* utiliser les types de vulnérability */}
                                    {/* {s_list.bages.map((badge: string) => {
                                        return (
                                            <label className="scope-badges">
                                                {badge}
                                            </label>
                                        );
                                    })} */}
                                </td>
                                <td className="scope-table-action">
                                    <input
                                        type="button"
                                        value="Add"
                                        className="borderBtn"
                                        onClick={NavAddVul}
                                    />
                                    {!isPentester && (
                                        <>
                                            <AiIcons.AiFillDelete
                                                className="scope-action-icons"
                                                style={{ color: 'red' }}
                                                onClick={() => delScope(index)}
                                            />
                                            <AiIcons.AiFillEdit className="scope-action-icons" />
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
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

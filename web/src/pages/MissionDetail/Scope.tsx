import React, { useState, useEffect } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import Feedbacks from '../../component/Feedback';
import config from '../../config';

export default function Scope(/* need to add list as a param here */) {
    const [keyword, setKeyword] = useState('');
    const [scope, setScope] = useState([]);
    const [missionId, setMissionId] = useState(0);
    const [Title, setTitle] = useState('');
    const [Team, setTeam] = useState(0);
    const [createBy, setCreateBy] = useState();
    const [lastEdit, setLastEdit] = useState();
    const [start, setStart] = useState<Dayjs>(dayjs());
    const [end, setEnd] = useState<Dayjs>(dayjs());
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const isPentester = Cookies.get('Role') === '1';

    const recordsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [record, setRecord] = useState([]);
    const [npage, setNPage] = useState(0);
    const [nums, setNums] = useState<any[]>([]);
    let lastIndex = currentPage * recordsPerPage;
    let firstIndex = lastIndex - recordsPerPage;
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
                setOpen(true);
                setMessage('Deleted !', 'success');
                setScope(newScope);
            })
            .catch((e) => {
                setMessage(e.message, 'error');
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

    const searchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setKeyword(event.target.value);
    };

    const getReport = async () => {
        await axios({
            method: 'get',
            url: `${config.apiUrl}/download-report`,
            data: { mission: missionId },
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${Cookies.get('Token')}`,
            },
        })
            .then((data) => {
                // here to open a link in new tab, replace google link by our url
                window.open('https://google.fr', '_blank', 'noreferrer');
                setMessage('Created!', 'success');
            })
            .catch((e) => {
                throw e;
            });
    };

    const searchScope = () => {
        let find = false;
        for (let i = 0; i < scope.length; i += 1) {
            if (scope[i] === keyword) {
                const p = Math.floor(i / recordsPerPage) + 1;
                if (i % 5 === 0) setCurrentPage(p - 1);
                else setCurrentPage(p);
                find = true;
            }
            if (find === true) break;
        }
    };

    useEffect(() => {
        setMissionId(location.state.missionId);
        // setScope(location.state.scopeList);
    }, []);

    useEffect(() => {
        getMission();
        setRecord(scope.slice(firstIndex, lastIndex));
    }, [missionId, scope]);

    useEffect(() => {
        setNPage(Math.ceil(scope.length / recordsPerPage));
        const n = [...Array(npage + 1).keys()].slice(1);
        setNums(n);
    }, [record]);

    useEffect(() => {
        lastIndex = currentPage * recordsPerPage;
        firstIndex = lastIndex - recordsPerPage;
        setRecord(scope.slice(firstIndex, lastIndex));
    }, [currentPage]);

    return (
        <>
            {open && (
                <Feedbacks
                    mess={message.mess}
                    color={message.color}
                    open={open}
                    close={handleClose}
                />
            )}
            <div className="mission-tool-line">
                <div className="search-name">
                    <div className="mission-input-block">
                        <input
                            type="text"
                            placeholder="Search by name"
                            className="scope-form-control"
                            name="searchword"
                            onChange={searchKeyword}
                        />
                    </div>
                    <button
                        type="button"
                        className="searchBtn"
                        onClick={searchScope}
                    >
                        Search
                    </button>
                </div>

                <button
                    type="button"
                    onClick={getReport}
                    className="input_btn mission-borderBtn"
                >
                    GET REPORT
                </button>
            </div>
            <table className="no_center_container">
                <tbody>
                    <tr>
                        {/* <th>Status</th> */}
                        <th className="md-5">Name</th>
                        {!isPentester && <th className="md-2">Actions</th>}
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
                                {!isPentester && (
                                    <td className="scope-table-action">
                                        <AiIcons.AiFillDelete
                                            className="scope-action-icons"
                                            style={{ color: 'red' }}
                                            onClick={() => delScope(index)}
                                        />
                                    </td>
                                )}
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

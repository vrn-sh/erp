import React, { useState, useEffect } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, CircularProgress } from '@mui/material';
import Feedbacks from '../../component/Feedback';
import config from '../../config';
import { getCookiePart } from '../../crypto-utils';

export default function Scope() {
    const [scope, setScope] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [missionId, setMissionId] = useState(0);
    const [Title, setTitle] = useState('');
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

    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';

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
                    scope: newScope,
                    created_by: createBy,
                    last_updated_by: lastEdit,
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
                    },
                }
            )
            .then(() => {
                setOpen(true);
                setMessage('Deleted !', 'success');
                setScope(newScope);
                setRecord(newScope.slice(firstIndex, lastIndex));
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    const getMission = async () => {
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/mission/${missionId}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                setScope(data.data.scope);
                setTitle(data.data.title);
                setEnd(dayjs(data.data.end));
                setStart(dayjs(data.data.start));
                setCreateBy(data.data.created_by);
                setLastEdit(data.data.last_updated_by);
                setRecord(data.data.scope.slice(firstIndex, lastIndex));
            })
            .catch((e) => {
                throw e;
            })
            .finally(() => {
                setIsLoad(false);
            });
    };

    useEffect(() => {
        setMissionId(location.state.missionId);
    }, []);

    useEffect(() => {
        if (missionId !== 0) {
            getMission();
        }
    }, [missionId]);

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
            {isLoad ? (
                <Box sx={{ width: '100%', marginTop: '5%' }}>
                    <CircularProgress color="secondary" />
                </Box>
            ) : (
                <table className="no_center_container">
                    <tbody>
                        <tr>
                            <th>Status</th>
                            <th className="md-5">Name</th>
                            {!isPentester && <th className="md-2">Actions</th>}
                        </tr>
                        {record.map((s_list, index) => {
                            return (
                                <tr>
                                    <td style={{ fontSize: '18px' }}>
                                        {s_list ? (
                                            <AiIcons.AiOutlineCheckCircle
                                                size="25px"
                                                style={{
                                                    marginLeft: '8px',
                                                    color: 'grey',
                                                }}
                                            />
                                        ) : (
                                            <AiIcons.AiOutlineCloseCircle
                                                size="25px"
                                                style={{
                                                    marginLeft: '8px',
                                                    color: 'grey',
                                                }}
                                            />
                                        )}
                                    </td>
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
            )}
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

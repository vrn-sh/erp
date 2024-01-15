import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as IoIcons from 'react-icons/io';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../../../config';
import Feedbacks from '../../../component/Feedback';
import SelectMission from '../../../component/SelectMission';
import { getCookiePart } from '../../../crypto-utils';

export default function CrtSh() {
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [tmpIdentity, setTmpIdentity] = useState('');
    const [inputIdentity, setInputIdentity] = useState('');
    const [missionId, setMissionId] = useState(-1);
    const [success, setSuccess] = useState(false);
    const location = useLocation();
    const [crtData, setCrtData] = useState<
        {
            id: number;
            logged_at: string;
            not_before: string;
            not_after: string;
            name: string;
            ca: {
                C: string;
                O: string;
                CN: string;
            };
        }[]
    >([
        {
            id: 0,
            logged_at: '',
            not_before: '',
            not_after: '',
            name: '',
            ca: {
                C: '',
                O: '',
                CN: '',
            },
        },
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTmpIdentity(inputIdentity);
        setTmpIdentity(e.target.value);
    };

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

    const handleKeyDown = (event: { key: string }) => {
        if (event.key === 'Enter') {
            setInputIdentity(tmpIdentity);
        }
    };

    const searchIdentity = async () => {
        setOpen(true);
        if (missionId === -1 || tmpIdentity.length === 0) {
            setMessage('Please enter a correct identity', 'error');
            return;
        }
        setMessage('Loading...', 'info');
        await axios(
            `${config.apiUrl}/crtsh?mission_id=${missionId}&domain=${tmpIdentity}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            }
        )
            .then((data) => {
                setOpen(true);
                setCrtData(data.data);
                setSuccess(true);
                setMessage('Succeed to load!', 'success');
            })
            .catch((e) => {
                setOpen(true);
                setSuccess(false);
                setMessage(e.response.data.dump[0].error, 'error');
            });
    };

    const updateIdentity = async () => {
        setOpen(true);
        if (missionId === -1 || tmpIdentity.length === 0) {
            setMessage('Please enter a correct identity', 'error');
            return;
        }
        setMessage('Loading...', 'info');
        setOpen(true);
        await axios(
            `${config.apiUrl}/crtsh?mission_id=${missionId}&domain=${tmpIdentity}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            }
        )
            .then((data) => {
                setCrtData(data.data.dump);
                setSuccess(true);
                setMessage('Succeed to load!', 'success');
            })
            .catch((e) => {
                setSuccess(false);
                setMessage(e.response.data.dump[0].error, 'error');
            });
    };

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    let records = crtData.slice(firstIndex, lastIndex);
    let npage = Math.ceil(crtData.length / recordsPerPage);

    useEffect(() => {
        setMissionId(location.state.missionId);
    }, []);

    useEffect(() => {
        records = crtData.slice(firstIndex, lastIndex);
        npage = Math.ceil(crtData.length / recordsPerPage);
    }, [crtData, success]);

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

    const changePage = (e: string) => {
        setCurrentPage(parseInt(e, 10));
    };

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                searchIdentity();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [missionId, tmpIdentity]);

    return (
        <>
            <div className="crt_input">
                <input
                    className="crt-form-control"
                    placeholder="Enter an Identity"
                    type="text"
                    name="identity"
                    onChange={handleChange}
                />

                <button
                    type="button"
                    onClick={searchIdentity}
                    className="searchBtn"
                    onKeyDown={handleKeyDown}
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={updateIdentity}
                    className="searchBtn"
                >
                    Update crt result
                </button>
            </div>
            <table
                style={{ marginTop: '4px', height: '120px' }}
                className="no_center_container"
            >
                <tbody>
                    <thead>
                        <tr>
                            <th className="md-1">Crt.sh ID</th>
                            <th className="md-1">Logged At</th>
                            <th className="md-1">Not Before</th>
                            <th className="md-1">Not After</th>
                            <th className="md-1">Name</th>
                            <th className="md-3">Issuer Name</th>
                        </tr>
                    </thead>
                    {success &&
                        records?.map((crt) => {
                            return (
                                <tbody>
                                    <tr>
                                        <td>{crt.id}</td>
                                        <td>{crt.logged_at}</td>
                                        <td>{crt.not_before}</td>
                                        <td>{crt.not_after}</td>
                                        <td>{crt.name}</td>
                                        <td>
                                            C: {crt.ca?.C} | O: {crt.ca?.O} |
                                            CN: {crt.ca?.CN}
                                        </td>
                                    </tr>
                                </tbody>
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
                    <input
                        type="number"
                        key={currentPage}
                        onChange={(e) => changePage(e.target.value)}
                        defaultValue={JSON.stringify(currentPage)}
                        min="1"
                        max={npage}
                        className="crt-pagination"
                        onKeyDown={(event) => {
                            if (!/[0-9]|Backspace/.test(event.key))
                                event.preventDefault();
                        }}
                    />{' '}
                    / {npage}
                    <li className="page-item">
                        <a href="#" className="page-link" onClick={nextPage}>
                            <IoIcons.IoIosArrowForward />
                        </a>
                    </li>
                </ul>
            </nav>
            {open && (
                <Feedbacks
                    mess={message.mess}
                    color={message.color}
                    open={open}
                    close={handleClose}
                />
            )}
        </>
    );
}

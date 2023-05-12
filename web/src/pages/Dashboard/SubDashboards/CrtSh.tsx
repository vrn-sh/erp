import React, { useState, useEffect } from 'react';
import * as IoIcons from 'react-icons/io';
import axios from 'axios';
import Cookies from 'js-cookie';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import config from '../../../config';
import Feedbacks from '../../../component/Feedback';

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
    const [crtData, setCrtData] = useState<
        {
            id: number;
            logged_at: string;
            not_before: string;
            not_after: string;
            name: string;
            ca: {
                caid: number;
                name: string;
                parsed_name: {
                    C: string;
                    O: string;
                    CN: string;
                };
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
                caid: 0,
                name: '',
                parsed_name: {
                    C: '',
                    O: '',
                    CN: '',
                },
            },
        },
    ]);
    const [list, setList] = useState<
        {
            value: number;
            label: string;
        }[]
    >([]);

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
            setMessage('please select a mission', 'error');
            return;
        }
        setMessage('Loading...', 'info');
        axios(
            `${config.apiUrl}/crtsh?mission_id=${missionId}&domain=${tmpIdentity}`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            }
        )
            .then((data) => {
                setOpen(true);
                setCrtData(data.data.dump);
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
            setMessage('please select a mission', 'error');
            return;
        }
        setMessage('Loading...', 'info');
        setOpen(true);
        axios(
            `http://127.0.0.1:8000/crtsh?mission_id=${missionId}&domain=${tmpIdentity}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
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

    const getMission = async () => {
        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                const tab = [];
                for (let i = 0; i < data.data.results.length; i += 1) {
                    const res = data.data.results[i];
                    tab.push({
                        value: res.id,
                        label: res.title,
                    });
                }
                tab.reverse();
                setList(tab);
            })
            .catch((e) => {
                throw e.message;
            });
    };
    useEffect(() => {
        getMission();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    let records = crtData.slice(firstIndex, lastIndex);
    let npage = Math.ceil(crtData.length / recordsPerPage);

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
    const handleMissionSelect = (event: SelectChangeEvent) => {
        setMissionId(parseInt(event.target.value, 10));
    };

    return (
        <>
            <div className="crt_input">
                <FormControl
                    variant="standard"
                    sx={{
                        m: 1,
                        minWidth: 100,
                        fontSize: '12px',
                        margin: '0 1rem',
                    }}
                >
                    <InputLabel id="demo-simple-select-standard-label">
                        Choose a mission
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={JSON.stringify(missionId)}
                        label="mission"
                        onChange={handleMissionSelect}
                    >
                        {list.map((elem) => {
                            return (
                                <MenuItem value={elem.value}>
                                    {elem.label}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <div className="form-group">
                    <label style={{ zIndex: 'unset' }}>Enter an Identity</label>
                    <input
                        className="form-control"
                        type="text"
                        name="identity"
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="button"
                    onClick={searchIdentity}
                    className="searchBtn"
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
                                        <td>{crt.ca?.name}</td>
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

import React, { useState } from 'react';
import * as IoIcons from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import DorkList from '../../../assets/strings/en/dorks.json';
import Feedbacks from '../../../component/Feedback';

export default function DorkEngine() {
    const [tmpDomain, setTmpDomain] = useState('');
    const [inputDomain, setInputDomain] = useState('');
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

    const getLink = (path: string) => {
        const res = path.replace('{{DOMAIN}}', inputDomain);
        return res;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTmpDomain(e.target.value);
    };

    const handleKeyDown = (event: { key: string }) => {
        setOpen(true);
        if (event.key === 'Enter') {
            setInputDomain(tmpDomain);
            setMessage('Searching domain', 'success');
        }
    };

    const searchDomain = () => {
        setOpen(true);
        setInputDomain(tmpDomain);
        setMessage('Searching domain', 'success');
    };

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = DorkList.dorks.slice(firstIndex, lastIndex);
    const npage = Math.ceil(DorkList.dorks.length / recordsPerPage);
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

    return (
        <>
            <div
                style={{ marginTop: '4px', justifyContent: 'center' }}
                className="dork_input"
            >
                {open && (
                    <Feedbacks
                        mess={message.mess}
                        color={message.color}
                        open={open}
                        close={handleClose}
                    />
                )}
                <input
                    type="text"
                    placeholder="Enter domain"
                    name="domain"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="crt_input_field"
                />
                <button
                    type="button"
                    onClick={searchDomain}
                    className="searchBtn"
                >
                    Search
                </button>
            </div>
            <table style={{ marginTop: '4px' }} className="no_center_container">
                {records.map((dork) => {
                    return (
                        <tbody key={dork[0].id}>
                            <tr>
                                <td>
                                    <a
                                        href={getLink(dork[0].path)}
                                        className="dork_link"
                                    >
                                        {dork[0].title}
                                    </a>
                                </td>
                                <td>
                                    <a
                                        href={getLink(dork[1].path)}
                                        className="dork_link"
                                    >
                                        {dork[1].title}
                                    </a>
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

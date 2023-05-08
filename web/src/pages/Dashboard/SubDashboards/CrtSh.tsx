import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as IoIcons from 'react-icons/io';
import Crt from '../../../assets/strings/en/crt.json';

export default function CrtSh() {
    const [tmpIdentity, setTmpIdentity] = useState('');
    const [inputIdentity, setInputIdentity] = useState('');

    // const getLink = (path: string) => {
    //     const res = path.replace('{{ID}}', inputIdentity);
    //     return res;
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTmpIdentity(inputIdentity);
        setTmpIdentity(e.target.value);
    };

    const handleKeyDown = (event: { key: string }) => {
        if (event.key === 'Enter') {
            setInputIdentity(tmpIdentity);
        }
    };

    const searchIdentity = () => {
        setTmpIdentity(tmpIdentity);
        toast.success('Searching domain');
    };

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = Crt.slice(firstIndex, lastIndex);
    const npage = Math.ceil(Crt.length / recordsPerPage);

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

    return (
        <>
            <div className="dork_input">
                <div>
                    <Toaster position="top-center" reverseOrder={false} />
                </div>
                <label>Target Identity</label>
                <input
                    type="text"
                    placeholder="Enter an Identity"
                    name="identity"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="sub_input_field"
                />
                <button
                    type="button"
                    onClick={searchIdentity}
                    className="searchBtn"
                >
                    Search
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
                            <th className="md-1">CA ID</th>
                            <th className="md-3">CA Name</th>
                        </tr>
                    </thead>
                    {records.map((crt) => {
                        return (
                            <tbody>
                                <tr>
                                    <td>{crt.id}</td>
                                    <td>{crt.logged_at}</td>
                                    <td>{crt.not_before}</td>
                                    <td>{crt.not_after}</td>
                                    <td>{crt.name}</td>
                                    <td>{crt.ca.caid}</td>
                                    <td>{crt.ca.name}</td>
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
        </>
    );
}

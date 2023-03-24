import React, { useState } from 'react';
import DorkList from '../../../assets/strings/en/dorks.json';
import * as IoIcons from 'react-icons/io';

export default function DorkEngine() {
    const [ tmpDomain, setTmpDomain ] = useState("");
    const [ inputDomain, setInputDomain ] = useState("");

    const getLink = (domain: string, pos: string, path: string, ) => {
        let res = "";
        if (pos === "before") {
            res = domain.concat(tmpDomain).concat(path);
        } else {
            res = domain.concat(path).concat(tmpDomain);
        }
        return res
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTmpDomain(e.target.value);
    };
    
    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            setInputDomain(tmpDomain);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 3;
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
            <input
                type="text" 
                placeholder='Enter domain' 
                name="domain"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="dork-input"
            />
            <table className='no_center_container'>
                {records.map((dork) => {
                    return (
                        <tbody key={dork[0].id}>
                            <tr>
                                <td>
                                    <a href={getLink(dork[0].domain, dork[0].position, dork[0].path)}>
                                        {dork[0].title}
                                    </a>
                                </td>
                                <td>
                                    <a href={getLink(dork[1].domain, dork[1].position, dork[1].path)}>
                                        {dork[1].title}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    )
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
    )
}
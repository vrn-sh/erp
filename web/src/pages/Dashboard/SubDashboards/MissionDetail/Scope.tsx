import React, { useState } from 'react';
import '../../Dashboard.scss';
import './MissionDetail.scss';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import scope_list from '../../../../assets/strings/en/mission_scope.json';

export default function Scope(/* need to add list as a param here */) {
    const [keyword, setKeyword] = useState('');

    const recordsPerPage = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = scope_list.scope.slice(firstIndex, lastIndex);
    const npage = Math.ceil(scope_list.scope.length / recordsPerPage);
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

    const searchKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setKeyword(event.target.value);
    };

    const searchScope = () => {
        let find = false;
        for (let i = 0; i < scope_list.scope.length; i += 1) {
            if (scope_list.scope[i].name.toLowerCase().includes(keyword)) {
                const p =
                    Math.floor(scope_list.scope[i].id / recordsPerPage) + 1;
                if (scope_list.scope[i].id % 3 === 0) changePage(p - 1);
                else changePage(p);
                find = true;
            }
            if (find === true) break;
        }
    };

    return (
        <>
            <div className="mission-tool-line">
                <div className="search-name">
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
                </div>

                <button type="button" className="input_btn mission-borderBtn">
                    GET REPORT
                </button>
            </div>
            <table className="no_center_container">
                <tbody>
                    <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Badges</th>
                        <th>Actions</th>
                    </tr>
                    {records.map((s_list) => {
                        return (
                            <tr key={s_list.id}>
                                <td style={{ fontSize: '18px' }}>
                                    {s_list.status ? (
                                        <AiIcons.AiOutlineCheckCircle />
                                    ) : (
                                        <AiIcons.AiOutlineCloseCircle />
                                    )}
                                </td>
                                <td id="name">{s_list.name}</td>
                                <td>
                                    {s_list.bages.map((badge) => {
                                        return (
                                            <label
                                                style={{
                                                    padding: 0,
                                                    margin: 0,
                                                }}
                                            >
                                                {badge}{' '}
                                            </label>
                                        );
                                    })}
                                </td>
                                <td className="scope-table-action">
                                    <input
                                        type="button"
                                        value="Add"
                                        className="borderBtn"
                                    />
                                    <AiIcons.AiFillDelete
                                        className="scope-action-icons"
                                        style={{ color: 'red' }}
                                    />
                                    <AiIcons.AiFillEdit className="scope-action-icons" />
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

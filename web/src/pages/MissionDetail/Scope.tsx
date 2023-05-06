import React, { useState, useEffect } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
// import scope_list from '../../assets/strings/en/mission_scope.json';

export default function Scope(/* need to add list as a param here */) {
    const [keyword, setKeyword] = useState('');
    const [scope, setScope] = useState([]);

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
        setScope(location.state.scopeList);
    }, []);

    useEffect(() => {
        setRecord(scope.slice(firstIndex, lastIndex));
        setNPage(Math.ceil(scope.length / recordsPerPage));
        const n = [...Array(npage + 1).keys()].slice(1);
        setNums(n);
        // searchScope();
    }, [scope]);
    return (
        <>
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
                    {record.map((s_list) => {
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

import React, { useState } from 'react';
// import * as IoIcons from 'react-icons/io';
// import DorkList from '../../../assets/strings/en/dorks.json';

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

    // const [currentPage, setCurrentPage] = useState(1);
    // const recordsPerPage = 3;
    // const lastIndex = currentPage * recordsPerPage;
    // const firstIndex = lastIndex - recordsPerPage;
    // const records = DorkList.dorks.slice(firstIndex, lastIndex);
    // const npage = Math.ceil(DorkList.dorks.length / recordsPerPage);
    // const nums = [...Array(npage + 1).keys()].slice(1);

    // const nextPage = () => {
    //     if (currentPage !== npage) {
    //         setCurrentPage(currentPage + 1);
    //     }
    // };

    // const prePage = () => {
    //     if (currentPage > 1) {
    //         setCurrentPage(currentPage - 1);
    //     }
    // };

    // const changePage = (n: number) => {
    //     setCurrentPage(n);
    // };

    return (
        <>
            <div className="dork_input">
                <input
                    type="text"
                    placeholder="Enter an Identity"
                    name="identity"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="sub_input_field"
                />
            </div>
            <table className="no_center_container" />
            {/* <nav>
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
            </nav> */}
        </>
    );
}

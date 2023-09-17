import React, { useState } from 'react';
import Modal from 'react-modal';
import './Dashboard.scss';
import DashboardMission from './DashboardMission';

Modal.setAppElement('#root');

export default function SubDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const formRows = [
        {
            name: "lport",
            type: "integer",
            query: "(query)",
            defaultValue: "Default value: 4444",
            placeholder: "4444",
        },
        {
            name: "laddr",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: 10.0.2.2",
            placeholder: "10.0.2.2",
        },
        {
            name: "exploit",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: x64/shell_reverse_tcp",
            placeholder: "x64/shell_reverse_tcp",
        },
        {
            name: "arch",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: x64",
            placeholder: "x64",
        },
        {
            name: "os",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: windows",
            placeholder: "windows",
        },
        {
            name: "output_type",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: exe",
            placeholder: "exe",
        },
        {
            name: "method",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: createRemoteThread",
            placeholder: "createRemoteThread",
        },
        {
            name: "exit_func",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: exit_func",
            placeholder: "exit_func",
        },
        {
            name: "encoder",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: encoder",
            placeholder: "encoder",
        },
        {
            name: "exclude_bytes",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: exclude_bytes",
            placeholder: "exclude_bytes",
        },
        {
            name: "entropy",
            type: "string",
            query: "(query)",
            defaultValue: "Default value: entropy",
            placeholder: "entropy",
        },
    ];

    return (
        <div className="dashboard-pages">
            <div className="page-info">
                <h1>Welcome to your dashboard</h1>
                <button className="btn" onClick={openModal}>
                    General payload
                </button>
                <form>
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="General Payload Modal"
                    >
                    <h1>General payload</h1>
                        <div className="form-row">
                            <div className="column">
                                <label>Name</label>
                            </div>
                            <div className="column">
                                <label>Description</label>
                            </div>
                        </div>
                        {formRows.map((row, index) => (
                            <div className="form-row" key={index}>
                                <div className="column">
                                    <div className="small-row">
                                        {row.name}
                                    </div> 
                                    <div className="small-row">
                                        ({row.type})
                                    </div> 
                                    <div className="small-row">
                                        {row.query}
                                    </div>                                       
                                </div>
                                <div className="column">
                                    <div className="small-row">
                                        {row.defaultValue}
                                    </div>
                                    <div className="small-row">
                                        <input type="text" placeholder={row.placeholder} />
                                    </div>                                    
                                </div>
                            </div>
                        ))}
                        <button onClick={closeModal}>Close</button>
                    </Modal>
                </form>
            </div>

            <div className="assigned-missions">
                <DashboardMission />
            </div>
        </div>
    );
}

// Import necessary libraries
import React, { useState } from 'react';
import Modal from 'react-modal';
import './Dashboard.scss';
import DashboardMission from './DashboardMission';

// Initialize react-modal
Modal.setAppElement('#root'); // Make sure to set your root element here

export default function SubDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // State to store form data
    const [formData, setFormData] = useState({
        lport: '4444',
        laddr: '10.0.2.2',
        exploit: 'x64/shell_reverse_tcp',
        arch: 'x64',
        os: 'windows',
        output_type: 'exe',
    });

    // Function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to submit the form data to the specified URL using curl
    async function submitForm() {
        try {
            const apiKey = 'c9083d45b7a867f26772f3f0a8c104a2';
            const apiUrl = `http://localhost:1337/load_shellcode?lport=${formData.lport}&laddr=${formData.laddr}&exploit=${encodeURIComponent(formData.exploit)}&arch=${formData.arch}&os=${formData.os}&output_type=${formData.output_type}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Api-Key': apiKey,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`API Request Error: ${response.status}`);
            }

            var saveBinaryData = function (data, fileName) {
                var blob = new Blob([data], { type: "application/octet-stream" });
                var url = window.URL.createObjectURL(blob);
                
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                
                a.href = url;
                a.download = fileName;
                a.click();
                
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            };
            
            // Usage:
            // Replace `binaryData` with your binary data (e.g., the .exe file content)
            var binaryData = /* ... */;
            var fileName = "file.exe";
            
            saveBinaryData(binaryData, fileName);
            
            
        } catch (error) {
            console.error('API Request Error:', error);
        }
    }
    

    // Data for the form rows
    const formRows = [
        {
            name: 'lport',
            label: 'Local Port',
            defaultValue: '4444',
            placeholder: '4444',
        },
        {
            name: 'laddr',
            label: 'Local Address',
            defaultValue: '10.0.2.2',
            placeholder: '10.0.2.2',
        },
        {
            name: 'exploit',
            label: 'Exploit',
            defaultValue: 'x64/shell_reverse_tcp',
            placeholder: 'x64/shell_reverse_tcp',
        },
        {
            name: 'arch',
            label: 'Architecture',
            defaultValue: 'x64',
            placeholder: 'x64',
        },
        {
            name: 'os',
            label: 'Operating System',
            defaultValue: 'windows',
            placeholder: 'windows',
        },
        {
            name: 'output_type',
            label: 'Output Type',
            defaultValue: 'exe',
            placeholder: 'exe',
        },
        // Add more form rows here
    ];

    return (
        <div className="dashboard-pages">
            <div className="page-info">
                <h1>Welcome to your dashboard</h1>
                {/* Render a button to open the modal */}
                <button className="btn" onClick={openModal}>
                    General payload
                </button>
                <form style={{ display: isModalOpen ? 'block' : 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="General Payload Modal"
                        style={{
                            overlay: {
                                // Styles for the modal overlay (the background)
                                // You can set a background color or other styles here if needed
                            },
                            content: {
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                            }
                        }}
                    >
                    {/* Content inside the modal */}
                    <h2>General payload</h2>
                        <div className="form-row">
                            <div className="columnTitle" style={{ fontFamily: 'Poppins-Medium', border: '1px solid #ccc', borderRadius: '10px', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <label>Name</label>
                            </div>
                            <div className="columnTitle" style={{ fontFamily: 'Poppins-Medium', border: '1px solid #ccc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <label>Description</label>
                            </div>
                        </div>
                        {/* Map over the formRows array to generate form rows */}
                        {formRows.map((row, index) => (
                            <div className="form-row" key={index}>
                                <div className="column">
                                    <div className="small-row">
                                        {row.label}
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="small-row-default">
                                        Default value: {row.defaultValue}
                                    </div>
                                    <div className="small-row" style={{ borderRadius: '10px', border: '1px solid #ccc', padding: '5px' }}>
                                        <input
                                            type="text"
                                            name={row.name}
                                            placeholder={row.placeholder}
                                            value={formData[row.name]}
                                            onChange={handleInputChange}
                                            style={{ border: 'none', outline: 'none', width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={submitForm}>Submit</button>
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
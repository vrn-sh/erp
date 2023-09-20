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
            const apiUrl = `https://voron.djnn.sh/saas/load_shellcode?lport=${formData.lport}&laddr=${formData.laddr}&exploit=${encodeURIComponent(formData.exploit)}&arch=${formData.arch}&os=${formData.os}&output_type=${formData.output_type}`;
    
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Api-Key': apiKey,
                },
            });
    
            if (!response.ok) {
                throw new Error(`API Request Error: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('API Response:', data);
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
                <form>
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="General Payload Modal"
                    >
                    {/* Content inside the modal */}
                    <h1>General payload</h1>
                        <div className="form-row">
                            <div className="column" style={{ border: '1px solid #ccc' }}>
                                <label>Name</label>
                            </div>
                            <div className="column" style={{ border: '1px solid #ccc' }}>
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
                                    <div className="small-row">
                                        Default value: {row.defaultValue}
                                    </div>
                                    <div className="small-row">
                                        <input
                                            type="text"
                                            name={row.name}
                                            placeholder={row.placeholder}
                                            value={formData[row.name]}
                                            onChange={handleInputChange}
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


// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import './Dashboard.scss';
// import DashboardMission from './DashboardMission';

// Modal.setAppElement('#root');

// export default function SubDashboard() {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const openModal = () => {
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//     };

//     const formRows = [
//         {
//             name: "lport",
//             type: "integer",
//             query: "(query)",
//             defaultValue: "Default value: 4444",
//             placeholder: "4444",
//         },
//         {
//             name: "laddr",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: 10.0.2.2",
//             placeholder: "10.0.2.2",
//         },
//         {
//             name: "exploit",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: x64/shell_reverse_tcp",
//             placeholder: "x64/shell_reverse_tcp",
//         },
//         {
//             name: "arch",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: x64",
//             placeholder: "x64",
//         },
//         {
//             name: "os",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: windows",
//             placeholder: "windows",
//         },
//         {
//             name: "output_type",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: exe",
//             placeholder: "exe",
//         },
//         {
//             name: "method",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: createRemoteThread",
//             placeholder: "createRemoteThread",
//         },
//         {
//             name: "exit_func",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: exit_func",
//             placeholder: "exit_func",
//         },
//         {
//             name: "encoder",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: encoder",
//             placeholder: "encoder",
//         },
//         {
//             name: "exclude_bytes",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: exclude_bytes",
//             placeholder: "exclude_bytes",
//         },
//         {
//             name: "entropy",
//             type: "string",
//             query: "(query)",
//             defaultValue: "Default value: entropy",
//             placeholder: "entropy",
//         },
//     ];

//     return (
//         <div className="dashboard-pages">
//             <div className="page-info">
//                 <h1>Welcome to your dashboard</h1>
//                 <button className="btn" onClick={openModal}>
//                     General payload
//                 </button>
//                 <form>
//                     <Modal
//                         isOpen={isModalOpen}
//                         onRequestClose={closeModal}
//                         contentLabel="General Payload Modal"
//                     >
//                     <h1>General payload</h1>
//                         <div className="form-row">
//                             <div className="column">
//                                 <label>Name</label>
//                             </div>
//                             <div className="column">
//                                 <label>Description</label>
//                             </div>
//                         </div>
//                         {formRows.map((row, index) => (
//                             <div className="form-row" key={index}>
//                                 <div className="column">
//                                     <div className="small-row">
//                                         {row.name}
//                                     </div> 
//                                     <div className="small-row">
//                                         ({row.type})
//                                     </div> 
//                                     <div className="small-row">
//                                         {row.query}
//                                     </div>                                       
//                                 </div>
//                                 <div className="column">
//                                     <div className="small-row">
//                                         {row.defaultValue}
//                                     </div>
//                                     <div className="small-row">
//                                         <input type="text" placeholder={row.placeholder} />
//                                     </div>                                    
//                                 </div>
//                             </div>
//                         ))}
//                         <button onClick={closeModal}>Close</button>
//                     </Modal>
//                 </form>
//             </div>

//             <div className="assigned-missions">
//                 <DashboardMission />
//             </div>
//         </div>
//     );
// }

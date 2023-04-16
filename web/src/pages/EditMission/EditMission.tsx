import React, { useState } from 'react';
import './Mission.scss';
import '../Settings/Settings.scss';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';

type InputSizes = 'small' | 'medium' | 'large';

type InputProps = {
    label: string;
    size: InputSizes;
};

function Input({ label, size }: InputProps) {
    const [value, setValue] = useState('');

    return (
        <div className={`input input-${size}`}>
            <label htmlFor={`input-${label}`} className="input-label">
                {label}
            </label>
            <input
                id={`input-${label}`}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}

const UpdateMission = () => {
    // appel de l'API pour supprimer le groupe
};
const CancelMission = () => {
    // appel de l'API pour supprimer le groupe
};
const DeleteMission = () => {
    // appel de l'API pour supprimer le groupe
};

export default function EditMission() {
    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="page-info">
                    <div>
                        <h2 style={{ fontSize: '28px', fontFamily: 'Arial' }}>
                            Edit mission
                        </h2>
                    </div>
                    <div className="page-searcher">
                        <label>Search on page</label>
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>
                <div className="edit-container">
                    <div
                        style={{
                            margin: '20px',
                            textAlign: 'left',
                            width: '30%',
                        }}
                    >
                        <h3 style={{ margin: '0px' }}>Frame Mission Web</h3>
                        <p style={{ margin: '0px', fontSize: '17px' }}>
                            Change the mission's setting and details
                        </p>
                    </div>
                    <div className="edit-form">
                        <Input label="Title" size="medium" />
                        <Input label="Select a date Range" size="medium" />
                        <Input label="Description" size="medium" />
                        <Input label="Scope" size="medium" />
                        <Input label="Select a Team" size="medium" />
                        <br />
                        <div style={{ display: 'flex', width: '150px' }}>
                            <button
                                type="submit"
                                onClick={() => UpdateMission()}
                            >
                                Save Changes
                            </button>
                            <button
                                type="submit"
                                className="cancel-btn"
                                onClick={() => CancelMission()}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="cancel-btn"
                                onClick={() => DeleteMission()}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

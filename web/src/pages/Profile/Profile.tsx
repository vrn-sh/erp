import React, { useState } from 'react';
import './Profile.scss';
import '../Settings/Settings.scss';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import pp from '../../assets/testpp.png';

type InputSizes = 'small' | 'medium' | 'large';

type InputProps = {
    label: string;
    size: InputSizes;
    value: string;
};

type InfoProps = {
    t1: string;
    t2: string;
    c1: string;
    c2: string;
};

function Input({ label, size, value }: InputProps) {
    const [valuenew, setValue] = useState(value);

    return (
        <div className={`input input-${size}`}>
            <label htmlFor={`input-${label}`}>{label}</label>
            <input
                id={`input-${label}`}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}

function GroupInfo({ t1, t2, c1, c2 }: InfoProps) {
    return (
        <div>
            <div className="profile-infos">
                <p>{t1}</p>
                <span>{c1}</span>
            </div>
            <div className="profile-infos">
                <p>{t2}</p>
                <span>{c2}</span>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const [firstName, setFirstName] = useState('Clara');
    const [lastName, setlastName] = useState('XU');
    const [email, setEmail] = useState('yuhui.xu@epitech.eu');
    const [Username, setUsername] = useState('claraxuxu');
    const navigate = useNavigate();
    const [seeMission, setSeeMission] = useState(false);

    const goToSetting = () => {
        navigate('/settings');
    };

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="dashboard-pages">
                    <div className="page-info">
                        <h1>Profile</h1>
                    </div>

                    <div className="assigned-missions">
                        <div className="profile-container">
                            <div className="mainInfo-container">
                                <img
                                    className="profile-photo"
                                    alt="profile"
                                    src={pp}
                                />
                                <div className="profile-username">
                                    <h5>Username</h5>
                                    <p>Pentester</p>
                                </div>
                            </div>

                            <GroupInfo
                                t1="First name"
                                t2="Email"
                                c1="Clara"
                                c2="yuhui.xu@epitech.eu"
                            />

                            <GroupInfo
                                t1="Last name"
                                t2="Co-workers"
                                c1="Xu"
                                c2="5"
                            />
                            <GroupInfo t1="Missions" t2="Teams" c1="3" c2="2" />

                            <div className="btn-container">
                                <button
                                    type="button"
                                    onClick={goToSetting}
                                    className="set-button"
                                >
                                    Set general informations
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="page-info">
                        <h1>Teams</h1>
                    </div>

                    <div className="assigned-missions">
                        <div className="profile-container">
                            <table
                                style={{
                                    textAlign: 'left',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <th>Manager</th>
                                        <th>Created date</th>
                                        <th>Members</th>
                                        <th>Actions</th>
                                    </tr>
                                    <tr>
                                        <td>Test</td>
                                        <td>Clara</td>
                                        <td>01/01/2023</td>
                                        <td>6</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="set-button"
                                            >
                                                Open
                                            </button>
                                            <button
                                                type="button"
                                                className="set-button"
                                            >
                                                Mission
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import './Profile.scss';
import '../Settings/Settings.scss';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
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

type MissionDetail = {
    name: string;
    state: string;
    scope: string;
    des: string;
    id: number;
};

function MissionCard({ name, state, scope, des, id }: MissionDetail) {
    return (
        <div className="profile-mission-card">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: '1rem',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                    }}
                >
                    <h4>{name}</h4>
                    <Chip
                        label="Succeed"
                        color="success"
                        variant="outlined"
                        size="small"
                    />
                </div>
                <h4>{scope}</h4>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'end',
                    }}
                >
                    <button type="button" className="detail-btn">
                        Open
                    </button>
                </div>
            </div>
        </div>
    );
}

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
    const [role, setRole] = useState('pentester');
    const navigate = useNavigate();
    const [testvar, setTestVar] = useState({
        display: 'none',
    });

    const [missionStyle, setMissionStyle] = useState({
        backgroundColor: 'white',
        color: '#7c44f3',
    });

    const goToSetting = () => {
        navigate('/settings');
    };

    const MissionShow = () => {
        if (testvar.display === 'none') {
            setTestVar({ display: '' }); // cancel display style
            setMissionStyle({ backgroundColor: '#7c44f3', color: 'white' }); // change style mission btn
        } else if (testvar.display === '') {
            setTestVar({ display: 'none' });
            setMissionStyle({ backgroundColor: 'white', color: '#7c44f3' });
        }
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
                                    <h5>{Username}</h5>
                                    <p>{role}</p>
                                </div>
                            </div>

                            <GroupInfo
                                t1="First name"
                                t2="Email"
                                c1={firstName}
                                c2={email}
                            />

                            <GroupInfo
                                t1="Last name"
                                t2="Co-workers"
                                c1={lastName}
                                c2="10"
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
                                                onClick={MissionShow}
                                                style={missionStyle}
                                            >
                                                Mission
                                            </button>
                                        </td>
                                    </tr>
                                    <tr style={testvar}>
                                        <td colSpan={5}>
                                            <div className="profile-mission-detail">
                                                <MissionCard
                                                    name="test"
                                                    state="success"
                                                    scope="https://localhost:3000"
                                                    des="Lorem ipsum dolor sit amet, consectetur adipis. Lorem ipsum dolor sit amet consectetur adi"
                                                    id={0}
                                                />
                                            </div>
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

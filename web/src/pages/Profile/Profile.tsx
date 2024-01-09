import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './Profile.scss';
import '../Settings/Settings.scss';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import config from '../../config';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import TableSection from './TableSection';
import { genericRequest } from '../TokenVerification/TokenVerification';

type InfoProps = {
    t1: string;
    t2: string;
    c1: string;
    c2: string;
};

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
    const role = Cookies.get('Role');
    const navigate = useNavigate();
    const [NumMission, setNumMission] = useState(0);
    const [coworker, setCowoker] = useState(0);
    const [userInfos, setUserInfos] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        profile_image: '',
        phone_number: '',
    });

    const [teamList, setTeamList] = useState<
        {
            id: number;
            leader: {
                id: number;
                auth: {
                    username: string;
                    email: string;
                    first_name: string;
                    last_name: string;
                    last_login: string;
                    date_joined: string;
                    password: string;
                    phone_number: string | null;
                    role: number;
                    favorites: string | null;
                    profile_image: string | null;
                };
                creation_date: string;
            };
            name: string;
            people: number;
        }[]
    >([]);

    const [missionList, setMissionList] = useState<
        {
            id: number;
            status: string;
            title: string;
            scope: string[];
            team: number;
        }[]
    >([]);

    const goToSetting = () => {
        navigate('/settings');
    };

    const getUserInfos = async () => {
    try {
        let url = '';
        if (role === '2') url += 'manager';
        else url += 'pentester';

        const response = await genericRequest('GET', `/${url}/${Cookies.get('Id')}`, {}, navigate);
        setUserInfos(response.auth);
    } catch (error) {
        throw error;
    }
};

const getTeams = async () => {
    try {
        const response = await genericRequest('GET', '/team?page=1', {}, navigate);
        const res = response;

        const t = [];
        for (let j = 0; j < res.length; j += 1) {
            let f = false;
            if (res[j].leader.auth.email === userInfos.email) f = true;
            for (let i = 0; i < res[j].members.length; i += 1) {
                if (res[j].members[i].auth.email === userInfos.email)
                    f = true;
            }
            if (f === true) {
                const member = res[j].members.length;
                const sum = coworker + member;
                delete res[j].members;
                res[j].people = member;
                setCowoker(sum);
                t.push(res[j]);
            }
        }
        setTeamList(t);
    } catch (error) {
        throw error;
    }
};

const getMission = async () => {
    try {
        const response = await genericRequest('GET', '/mission?page=1', {}, navigate);
        const res = response.results || [];
        res.forEach((item: { [key: string]: any }) => {
            delete item.start;
            delete item.end;
            delete item.recon;
            delete item.bucket_name;
            delete item.creation_date;
            delete item.last_updated;
            delete item.created_by;
            delete item.last_updated_by;
        });
        setMissionList(res);
        setNumMission(response.count || 0);
    } catch (error) {
        throw error;
    }
};


    useEffect(() => {
        getUserInfos();
    }, []);

    useEffect(() => {
        getTeams();
    }, [userInfos]);

    useEffect(() => {
        getMission();
    }, [teamList]);

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
                                {userInfos.profile_image ? (
                                    <img
                                        src={userInfos.profile_image} // Affichez l'image depuis l'état local
                                        alt="Profile"
                                        className="profile-photo"
                                    />
                                ) : (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FaUser size={32} />
                                    </div>
                                )}
                                <div className="profile-username">
                                    <h5>{userInfos.username}</h5>
                                    <p>
                                        {role === '1' ? 'Pentester' : 'Manager'}
                                    </p>
                                </div>
                            </div>
                            {/* eslint-disable */}
                            <GroupInfo
                                t1="First name"
                                t2="Email"
                                c1={
                                    userInfos.first_name !== null
                                        ? userInfos.first_name.length > 0
                                            ? userInfos.first_name
                                            : '-'
                                        : '-'
                                }
                                c2={
                                    userInfos.email !== null
                                        ? userInfos.email.length > 0
                                            ? userInfos.email
                                            : '-'
                                        : '-'
                                }
                            />
                            <GroupInfo
                                t1="Last name"
                                t2="Co-workers"
                                c1={
                                    userInfos.last_name !== null
                                        ? userInfos.last_name.length > 0
                                            ? userInfos.last_name
                                            : '-'
                                        : '-'
                                }
                                c2={String(coworker)}
                            />
                            {/* eslint-enable */}
                            <GroupInfo
                                t1="Missions"
                                t2="Teams"
                                c1={String(NumMission)}
                                c2={String(teamList.length)}
                            />
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
                                    {teamList.map((teamInfo) => {
                                        return (
                                            <TableSection
                                                teamInfo={teamInfo}
                                                missionList={missionList}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
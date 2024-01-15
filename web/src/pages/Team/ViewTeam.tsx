import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { RiEyeLine, RiUserFill } from 'react-icons/ri';
import Modal from 'react-modal';
import { PiSelectionSlashBold } from 'react-icons/pi';
import { Box, CircularProgress } from '@mui/material';
import TopBar from '../../component/SideBar/TopBar';
import SideBar from '../../component/SideBar/SideBar';
import config from '../../config';
import { getCookiePart } from '../../crypto-utils';
import './ViewTeam.scss';

interface Member {
    id: number;
    auth: {
        profileImage: any;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        last_login: string | null;
        date_joined: string;
        phone_number: string | null;
        role: number;
        favorites: string | null;
    };
    creation_date: string;
}
interface ProfilDetailsProps {
    label: string;
    data: string | null;
}
export function ProfilDetails({ label, data }: ProfilDetailsProps) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
            }}
        >
            <p className="team-popup-left">{label}</p>
            {/* eslint-disable */}
            {data === null ? (
                <p className="team-popup-right">-</p>
            ) : data.length === 0 ? (
                <p className="team-popup-right">-</p>
            ) : (
                <p className="team-popup-right">{data}</p>
            )}
            {/* eslint-enable */}
        </div>
    );
}

export default function ViewTeamDetails() {
    const { id } = useParams<{ id?: string }>();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLoad, setIsLoad] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };
    const closeModal = () => {
        setModalIsOpen(false);
    };

    const [teamData, setTeamData] = useState<{
        id: number;
        name: string;
        manager: string;
        nbMember: number;
        nbMission: number;
        members: Member[];
    }>({
        id: 0,
        name: '',
        manager: '',
        nbMember: 0,
        nbMission: 0,
        members: [],
    });

    const getTeamDetails = async () => {
        if (!id) return; // Vérifier si id existe
        setIsLoad(true);

        const teamId = parseInt(id, 10);
        const response = await axios
            .get(`${config.apiUrl}/team/${teamId}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .finally(() => {
                setIsLoad(false);
            });
        const team = response.data;
        const mission = 0; // Ajoutez la valeur correcte pour mission
        setTeamData({
            id: team.id,
            name: team.name,
            manager: team.leader.auth.username,
            nbMember: team.members.length,
            nbMission: mission,
            members: team.members,
        });
    };

    useEffect(() => {
        getTeamDetails();
    }, [id]); // Ajouter id comme dépendance

    const renderMembers = () => {
        if (!teamData) return null;

        const members = teamData.members.map((member) => {
            let roleText = '';
            if (member.auth.role === 1) {
                roleText = 'Pentester';
            } else if (member.auth.role === 2) {
                roleText = 'Manager';
            }

            return (
                <div className="team-detail-members-container" key={member.id}>
                    <div className="team-detail-members-cart">
                        {member.auth.profileImage ? (
                            <img
                                src={member.auth.profileImage}
                                alt="Profile"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                }}
                            />
                        ) : (
                            <RiUserFill
                                style={{ fontSize: '60px', color: 'white' }}
                            />
                        )}
                    </div>
                    <p
                        style={{
                            textAlign: 'center',
                            margin: '0px',
                            fontSize: '12px',
                            fontFamily: 'Poppins-Regular',
                        }}
                    >
                        @{member.auth.username}
                    </p>
                    <p
                        style={{
                            textAlign: 'center',
                            margin: '0px',
                            fontSize: '12px',
                            fontFamily: 'Poppins-Regular',
                        }}
                    >
                        {member.auth.email}
                    </p>
                    <p
                        style={{
                            textAlign: 'center',
                            margin: '0px',
                            fontWeight: 'bold',
                            fontSize: '10px',
                        }}
                    >
                        {roleText}
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '60%',
                        }}
                    >
                        <RiEyeLine
                            style={{ marginRight: '5px', fontSize: '12px' }}
                        />
                        <Link to="#" onClick={openModal}>
                            <span
                                style={{
                                    color: 'black',
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: '12px',
                                }}
                            >
                                View
                            </span>
                        </Link>

                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            contentLabel="Profile Modal"
                            style={{
                                content: {
                                    border: '1px solid #ccc',
                                    borderRadius: '10px',
                                    position: 'absolute',
                                    top: '30%',
                                    right: '50%',
                                    transform: 'translate(60%, -20%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px',
                                },
                            }}
                        >
                            <div className="team-detail-members-cart">
                                {member.auth.profileImage ? (
                                    <img
                                        src={member.auth.profileImage}
                                        alt="Profile"
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            borderRadius: '100%',
                                        }}
                                    />
                                ) : (
                                    <RiUserFill
                                        style={{
                                            fontSize: '60px',
                                            color: 'white',
                                        }}
                                    />
                                )}
                            </div>
                            <div className="team-popup-userinfo">
                                <ProfilDetails
                                    label="First name :"
                                    data={member.auth.first_name}
                                />
                                <ProfilDetails
                                    label="Last name :"
                                    data={member.auth.last_name}
                                />
                                <ProfilDetails
                                    label="Username :"
                                    data={member.auth.username}
                                />
                                <ProfilDetails
                                    label="Email :"
                                    data={member.auth.email}
                                />
                                <ProfilDetails label="Role :" data={roleText} />
                                <ProfilDetails
                                    label="Last_login :"
                                    data={member.auth.last_login}
                                />
                                <ProfilDetails
                                    label="Date joined :"
                                    data={member.auth.date_joined.substring(
                                        0,
                                        10
                                    )}
                                />
                                <ProfilDetails
                                    label="Phone number :"
                                    data={member.auth.phone_number}
                                />
                                <ProfilDetails
                                    label="Favorites :"
                                    data={member.auth.favorites}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                style={{ marginTop: '1rem' }}
                            >
                                Close
                            </button>
                        </Modal>
                    </div>
                </div>
            );
        });
        const rows: JSX.Element[] = [];
        for (let i = 0; i < members.length; i += 5) {
            const row = members.slice(i, i + 5);
            rows.push(
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '10px 0',
                    }}
                >
                    {row}
                </div>
            );
        }

        return rows;
    };

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="page-info">
                    <h1>Team details</h1>
                </div>
                <div className="edit-container">
                    {teamData ? (
                        <div
                            style={{
                                margin: '20px',
                                textAlign: 'left',
                                width: '100%',
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#f4f5f8',
                                    padding: '10px',
                                }}
                            >
                                <h4
                                    style={{
                                        margin: '5px',
                                        fontFamily: 'Poppins-Regular',
                                    }}
                                >
                                    Team Name: {teamData.name}
                                </h4>
                                <p style={{ margin: '5px', fontSize: '15px' }}>
                                    Leader: {teamData.manager}
                                </p>
                            </div>
                            <br />
                            <h4
                                style={{
                                    margin: '5px',
                                    fontFamily: 'Poppins-Regular',
                                }}
                            >
                                Members:
                            </h4>
                            {isLoad ? (
                                <Box sx={{ marginY: '5%', marginLeft: '40vw' }}>
                                    <CircularProgress color="secondary" />
                                </Box>
                            ) : (
                                renderMembers()
                            )}
                        </div>
                    ) : (
                        <p>Loading team data...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

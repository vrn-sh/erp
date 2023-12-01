import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { RiEyeLine, RiUserFill } from 'react-icons/ri';
import Modal from 'react-modal';
import TopBar from '../../component/SideBar/TopBar';
import SideBar from '../../component/SideBar/SideBar';
import config from '../../config';

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

export default function ViewTeamDetails() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);

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

        const teamId = parseInt(id, 10);
        const response = await axios.get(`${config.apiUrl}/team/${teamId}`, {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Token ${Cookies.get('Token')}`,
            },
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

    const goToProfile = (memberId: number) => {
        navigate('/profile');
    };

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
                <div
                    style={{
                        backgroundColor: '#f4f5f8',
                        padding: '10px',
                        margin: '10px',
                        width: '205px',
                        height: '250px',
                        border: '2px',
                        borderRadius: '5px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    key={member.id}
                >
                    <div
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#ccc',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '10px',
                        }}
                    >
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
                                    top: '50%',
                                    right: '50%',
                                    transform: 'translate(50%, -50%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px',
                                },
                            }}
                        >
                            <div
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ccc',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                }}
                            >
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
                                        style={{
                                            fontSize: '60px',
                                            color: 'white',
                                        }}
                                    />
                                )}
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 'auto',
                                        textAlign: 'right',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            margin: '0',
                                        }}
                                    >
                                        First name
                                    </p>
                                </div>
                                <p
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '12px',
                                        fontFamily: 'Poppins-Regular',
                                        margin: '0',
                                    }}
                                >
                                    |
                                </p>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        textAlign: 'left',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}
                                    >
                                        {member.auth.first_name}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 'auto',
                                        textAlign: 'right',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            margin: '0',
                                        }}
                                    >
                                        Last name
                                    </p>
                                </div>
                                <p
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '12px',
                                        fontFamily: 'Poppins-Regular',
                                        margin: '0',
                                    }}
                                >
                                    |
                                </p>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        textAlign: 'left',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}
                                    >
                                        {member.auth.last_name}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 'auto',
                                        textAlign: 'right',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            margin: '0',
                                        }}
                                    >
                                        Username
                                    </p>
                                </div>
                                <p
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '12px',
                                        fontFamily: 'Poppins-Regular',
                                        margin: '0',
                                    }}
                                >
                                    |
                                </p>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        textAlign: 'left',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}
                                    >
                                        {member.auth.username}
                                    </p>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 'auto',
                                        textAlign: 'right',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            margin: '0',
                                        }}
                                    >
                                        Email
                                    </p>
                                </div>
                                <p
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '12px',
                                        fontFamily: 'Poppins-Regular',
                                        margin: '0',
                                    }}
                                >
                                    |
                                </p>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        textAlign: 'left',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}
                                    >
                                        {member.auth.email}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 'auto',
                                        textAlign: 'right',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            margin: '0',
                                        }}
                                    >
                                        Role
                                    </p>
                                </div>
                                <p
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '12px',
                                        fontFamily: 'Poppins-Regular',
                                        margin: '0',
                                    }}
                                >
                                    |
                                </p>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        textAlign: 'left',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}
                                    >
                                        {roleText}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 'auto',
                                        textAlign: 'right',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            margin: '0',
                                        }}
                                    >
                                        Last_login
                                    </p>
                                </div>
                                <p
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '12px',
                                        fontFamily: 'Poppins-Regular',
                                        margin: '0',
                                    }}
                                >
                                    |
                                </p>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        textAlign: 'left',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}
                                    >
                                        {member.auth.last_login}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 'auto',
                                        textAlign: 'right',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            margin: '0',
                                        }}
                                    >
                                        Date joined
                                        {/* (Y-M-D) */}
                                    </p>
                                </div>
                                <p
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '12px',
                                        fontFamily: 'Poppins-Regular',
                                        margin: '0',
                                    }}
                                >
                                    |
                                </p>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        textAlign: 'left',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}
                                    >
                                        {member.auth.date_joined.substring(
                                            0,
                                            10
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 'auto',
                                        textAlign: 'right',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            margin: '0',
                                        }}
                                    >
                                        Phone number
                                    </p>
                                </div>
                                <p
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '12px',
                                        fontFamily: 'Poppins-Regular',
                                        margin: '0',
                                    }}
                                >
                                    |
                                </p>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        textAlign: 'left',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}
                                    >
                                        {member.auth.phone_number}
                                    </p>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: 'auto',
                                        textAlign: 'right',
                                        paddingRight: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            margin: '0',
                                        }}
                                    >
                                        Favorites
                                    </p>
                                </div>
                                <p
                                    style={{
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '12px',
                                        fontFamily: 'Poppins-Regular',
                                        margin: '0',
                                    }}
                                >
                                    |
                                </p>
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        textAlign: 'left',
                                        paddingLeft: '10px',
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            fontFamily: 'Poppins-Regular',
                                            fontWeight: 'bold',
                                            margin: '0',
                                        }}
                                    >
                                        {member.auth.favorites}
                                    </p>
                                </div>
                            </div>
                            <button type="button" onClick={closeModal}>
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
                    <h1>Meet our Team</h1>
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
                            {renderMembers()}
                        </div>
                    ) : (
                        <p>Loading team data...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

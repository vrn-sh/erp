import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import TopBar from '../../component/SideBar/TopBar';
import SideBar from '../../component/SideBar/SideBar';
import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../../config';
import { RiEyeLine, RiUserFill } from 'react-icons/ri';
import Modal from 'react-modal';


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
  };
  creation_date: string;
}

export default function ViewTeamDetails() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);


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
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTeamDetails();
  }, [id]); // Ajouter id comme dépendance

  const goToProfile = (member: Member) => {
    openModal(member);
  };
  const MemberModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Member Details"
        // Personnalisez le style du modal ici
      >
        {selectedMember && (
          <div>
            <h2>Member Details</h2>
            <div>
              <img src={selectedMember.auth.profileImage} alt="Profile" />
              <p>Username: {selectedMember.auth.username}</p>
              <p>Email: {selectedMember.auth.email}</p>
              <p>Phone Number: {selectedMember.auth.phone_number || 'N/A'}</p>
              <p>Last Login: {selectedMember.auth.last_login || 'N/A'}</p>
            </div>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    );
  };
    
  const openModal = (member: Member) => {
    setSelectedMember(member);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setSelectedMember(null);
    setModalIsOpen(false);
  };
    
  
    const renderMembers = () => {
        if (!teamData) {
          console.log('okok');
          return null;
        }
      
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
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                ) : (
                  <RiUserFill style={{ fontSize: '60px', color: 'white' }} />
                )}
              </div>
              <p style={{ textAlign: 'center', margin: '0px', fontSize: '12px', fontFamily: 'Poppins-Regular' }}>@
                {member.auth.username}
              </p>
              <p style={{ textAlign: 'center', margin: '0px', fontSize: '12px', fontFamily: 'Poppins-Regular' }}>
                {member.auth.email}
              </p>
              <p style={{ textAlign: 'center', margin: '0px', fontWeight: 'bold', fontSize: '10px' }}>
                {roleText}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft:'60%' }}>
                <RiEyeLine style={{ marginRight: '5px', fontSize: '12px' }} />
                <Link to="#" onClick={() => goToProfile(member)}>
                    <span style={{ color: 'black', fontFamily: 'Poppins-Regular', fontSize: '12px' }}>View</span>
                </Link>
            </div>
            </div>
          );
        });
        const rows: JSX.Element[] = [];
        for (let i = 0; i < members.length; i += 5) {
          const row = members.slice(i, i + 5);
          rows.push(
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
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
          <div>
            <h2 style={{ fontSize: '28px', fontFamily: 'Arial' }}>Meet our Team</h2>
          </div>
          <div className="page-searcher">
            <label>Search on page</label>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        <div className="edit-container">
          {teamData ? (
            <div style={{ margin: '20px', textAlign: 'left', width: '100%' }}>
              <div style={{backgroundColor: '#f4f5f8', padding: '10px',}}>
                <h3 style={{ margin: '5px' }}>Team Name: {teamData.name}</h3>
                <p style={{ margin: '5px', fontSize: '15px' }}>Leader:  {teamData.manager}</p>
              </div><br />
              <h4 style={{ margin: '5px' }}>Members:</h4>
              {renderMembers()}
              <MemberModal />
            </div>
          ) : (
            <p>Loading team data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
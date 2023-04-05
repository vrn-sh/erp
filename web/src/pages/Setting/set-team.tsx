import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import "./team.scss"

interface Group {
  id: number;
  name: string;
  role: string;
}

interface UserGroupsProps {
  userId: number;
  role: string;
}


interface InviteProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const InvitePopup: React.FC<InviteProps> = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Faites quelque chose avec l'email entré ici, par exemple, l'envoyer à un serveur via une requête HTTP

    // Réinitialiser l'état local de l'email et fermer le popup
    setEmail('');
    onRequestClose();
  };

  return (
    <Modal className={"popup"} isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Inviter un nouveau membre par email</h2>
      <form className='form-popup' onSubmit={handleFormSubmit}>
        <label  htmlFor="email">Email Address</label>
        <input  type='email' value={email} name='email' onChange={(e) => setEmail(e.target.value)}/>
        <button type="submit">Inviter</button>
      </form>
    </Modal>
  );
};


const SettingTeam: React.FC<UserGroupsProps> = ({ userId, role }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [maClasse, setMaClasse] = useState('action-ctn');
  const [width, setWidth] = useState('');
  role = "Manager";

  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(true);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await axios.get(`/api/users/${userId}/groups`);
      setGroups(response.data);
    };
    fetchGroups();
  }, [userId]);

  useEffect(() => {
    if (role === 'Manager') {
      setMaClasse('action-ctn-plus');
      setWidth('95px');
    } else {
      setMaClasse('action-ctn');
      setWidth('');
    }
  }, [role]);

  const handleDeleteGroup = (groupId: number) => {
    // appel de l'API pour supprimer le groupe
  };

  const handleResetGroup = (groupId: number) => {
    // appel de l'API pour réinitialiser le groupe
  };

  
    return (
      <div className='team-container'>
        <span className='left-side'><h1>My Team</h1></span>
        {groups.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Groupe</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td>{group.role}</td>
                  <td>
                    <div className={maClasse} style={{ width }}>
                        <button onClick={() => handleResetGroup(group.id)}>Reset</button>
                        <button className='dlt-btn' onClick={() => handleDeleteGroup(group.id)}>Delete</button>
                        {role === 'Manager' && <button >Add</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Groupe</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Group 1</td>
                  <td>{role}</td>
                  <td>
                    <div className={maClasse} style={{ width }}>
                        <button disabled>Reset</button>
                        <button className='dlt-btn' disabled>Delete</button>
                        {role === 'Manager' && <button disabled>Add</button>}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Test Group 2</td>
                  <td>{role}</td>
                  <td>
                    <div className={maClasse} style={{ width }}>
                        <button disabled>Reset</button>
                        <button className='dlt-btn' disabled>Delete</button>
                        {role === 'Manager' && <button onClick={handleButtonClick} >Add</button> }
                        <InvitePopup isOpen={isOpen} onRequestClose={handleClosePopup} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };  
  export default SettingTeam;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./team.scss"

interface Group {
  id: number;
  name: string;
  role: string;
}

interface UserGroupsProps {
  userId: number;
}
const SettingTeam: React.FC<UserGroupsProps> = ({ userId }) => {
    const [groups, setGroups] = useState<Group[]>([]);
  
    useEffect(() => {
      const fetchGroups = async () => {
        const response = await axios.get(`/api/users/${userId}/groups`);
        setGroups(response.data);
      };
      fetchGroups();
    }, [userId]);
  
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
                    <div className='flex'>
                        <button onClick={() => handleResetGroup(group.id)}>Reset</button>
                        <button className='dlt-btn' onClick={() => handleDeleteGroup(group.id)}>Delete</button>
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
                  <td>Pentester</td>
                  <td>
                    <div className='flex'>
                        <button disabled>Reset</button>
                        <button className='dlt-btn' disabled>Delete</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Test Group 2</td>
                  <td>Testeur de sécurité</td>
                  <td>
                    <div className='flex'>
                        <button disabled>Reset</button>
                        <button className='dlt-btn' disabled>Delete</button>
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
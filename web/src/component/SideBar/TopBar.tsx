import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import config from '../../config';
import axios from 'axios';

export default function TopBar() {
  const navigate = useNavigate();
  const role = Cookies.get('Role');
  const [userInfos, setUserInfos] = useState({
    username: '',
    profileImage: '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    getUserInfos();
  }, []); // Effect will run once when the component mounts

  const goProfile = () => {
    navigate('/settings');
  };

  const getUserInfos = async () => {
    let url = `${config.apiUrl}/`;
    if (role === '2') url += 'manager';
    else url += 'pentester';

    try {
      const response = await axios.get(`${url}/${Cookies.get('Id')}`, {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Token ${Cookies.get('Token')}`,
        },
      });

      const userData = response.data.auth;
      setUserInfos({
        username: userData.username,
        profileImage: userData.profile_image,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  return (
    <div className="top-bar">
      <div className="btn-left">
        {userInfos.first_name && userInfos.last_name ? (
          <span className="username">
            {userInfos.first_name} {userInfos.last_name}
          </span>
        ) : (
          <span className="username">{userInfos.username}</span>
        )}
        <span className="btn-profile" onClick={goProfile} role="presentation">
          {userInfos.profileImage ? (
            <img
              src={userInfos.profileImage}
              alt="Profile"
              className="profile-image"
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <FaIcons.FaUserCircle size="24px" color="#8A8A8A" />
          )}
        </span>
      </div>
    </div>
  );
}

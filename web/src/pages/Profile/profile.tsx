import React, { useState } from "react";
import "./profile.scss";
import "../Setting/setting.scss"
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import { FaRegUserCircle } from 'react-icons/fa';


type InputSizes = 'small' | 'medium' | 'large';

type InputProps = {
  label: string;
  size: InputSizes;
};


const Input = ({ label, size }: InputProps) => {
    const [value, setValue] = useState('');
  
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
  };

export default function ProfilePage() {
  return (
    <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="profile-container">
                  <div className="profile-infos">
                      <h1>General Infos</h1>
                      <div className="input-group">
                        <Input label="First Name" size="medium" />
                        <Input label="Last Name *" size="medium" />
                      </div>
                      <div className="input-group">
                        <Input label="Age" size="medium" />
                        <Input label="Gender *" size="medium" />
                      </div>
                      <div className="input-group">
                        <Input label="Email" size="medium" />
                        <Input label="Phone *" size="medium" />
                      </div>
                      <h1>Skills</h1>
                      <Input label="Skills" size="large" />  
                      <Input label="Certificates" size="medium" /> 
                      <Input label="Teams" size="medium" /> 
                      <div className="buttons-container">
                        <button className="submit-button">Update</button>
                      </div>
                  </div>

                  <div className="profile-pic">
                    <div className="cover-img">
                      <img src="../../assets/logo.svg" alt="" style={{ width: '150px', height: '150px', marginTop: '100px' , borderRadius:'50%', backgroundColor: 'white'}} />
                    </div>
                    <h1>Camelia Sama</h1>
                    <h3>Pentester Senior</h3>
                    <p>Lorem ipsum dolor sit amet,ecenas a eleifend elit. Curabitur ac vulputate mauris, ut consequat ex. Phasellus vel justo laoreet, pharetra ex non, ultricies eros. Suspendisse mollis bibendum justo, sit amet mattis massa fermentu.</p>
                  </div>
                </div>
            </div>
        </div>
  );
};
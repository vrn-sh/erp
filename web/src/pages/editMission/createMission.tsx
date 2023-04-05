import React, { useState } from "react";
import "./editMission.scss";
import "../Setting/setting.scss"
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import DateRangeInput from "./dateinput";


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

  const CreateM = () => {
    // appel de l'API pour supprimer le groupe
  };
  const  CancelMission = () => {
    // appel de l'API pour supprimer le groupe
  };

export default function CreateMission() {
  return (
    <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="edit-container">
                    <div style={{margin:'20px'}}>
                        <h1>Frame Mission Web</h1>
                        <h3>Change the mission's setting and details</h3>
                    </div>
                    <div className="edit-form">
                        <Input label="Title" size="medium" />  
                        <Input label="Select a date Range" size="medium" />
                        <DateRangeInput label="Select a date Range" size="medium" />
                        <Input label="Description" size="medium" />  
                        <Input label="Scope" size="medium" />
                        <Input label="Client" size="medium" />
                        <Input label="Credentials" size="medium" /> 
                        <Input label="Select a Team" size="medium" />
                        <br />
                        <div style={{display:'flex',width:'150px' }}>
                          <button onClick={() => CreateM()}>Save Changes</button>
                          <button onClick={() => CancelMission()}>Cancel</button>                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
};


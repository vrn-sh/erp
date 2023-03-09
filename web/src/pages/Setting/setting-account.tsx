import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';


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

export default function SettingAccount() {
  const [photoUrl, setPhotoUrl] = useState('');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
    };
  };
    return (
          <div className='container'>
            <div>
              <p>Avatar </p>
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="User profile picture"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
              ) : (
                <FaUserCircle
                  style={{ width: '50px', height: '50px' }}
                  onClick={() => document.getElementById('fileInput')?.click()}
                />
              )}
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>
            <div className="input-group">
                <Input label="Full name" size="medium" />
                <Input label="Email address *" size="medium" />
            </div>
            <Input label="Bio" size="large" />  
            <Input label="Customized link" size="medium" /> 

          <div className="buttons-container">
            <button className="submit-button">Save Changes</button>
            <button className="cancel-button">CANCEL</button>
          </div>
       </div>
    );
}

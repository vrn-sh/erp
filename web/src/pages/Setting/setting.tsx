import React, { useState } from 'react';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import "./setting.scss"
import { FaUser} from "react-icons/fa";
import {IoIosNotifications} from "react-icons/io";
import {BsCreditCard} from "react-icons/bs";
import {RiTeamLine} from "react-icons/ri"
import {BsFillShieldLockFill} from "react-icons/bs"
import SettingAccount from './setting-account';
import SettingNotification from './set-notif';
import SettingSecurity from './set-security';
import SettingBilling from './set-billing';
import SettingTeam from './set-team';

// Interface pour les données de sous-pages
interface SubPage {
    title: string;
    content: JSX.Element;
    icon: JSX.Element;
  }
  
  // Tableau de données de sous-pages
  const subPagesData: SubPage[] = [
    {
      title: "Account",
      content: <SettingAccount></SettingAccount>,
      icon: <FaUser style={{ fontSize: '20px' }}/>,
    },
    {
      title: "Notification",
      content: <SettingNotification></SettingNotification>,
      icon: <IoIosNotifications style={{ fontSize: '22px' }}/>,
    },
    {
      title: "Security",
      content: <SettingSecurity></SettingSecurity>,
      icon: <BsFillShieldLockFill style={{ fontSize: '22px' }}/>,
    },
    {
        title: "Billing",
        content: <SettingBilling></SettingBilling>,
        icon: <BsCreditCard style={{ fontSize: '22px' }}/>,
      },
      {
        title: "Team",
        content: <SettingTeam userId={0} role={''}></SettingTeam>,
        icon: <RiTeamLine style={{ fontSize: '22px' }} />,
      },
  ];

  
// Définition du composant de menu
const SettingsMenu = ({ selectedSubPage, setSelectedSubPage }: { selectedSubPage: number, setSelectedSubPage: (index: number) => void }) => {
    return (
      <div className='set-menu'>
        <ul >
          {/* Map sur le tableau de données pour créer des boutons de menu */}
          {subPagesData.map((item, index) => (
            <li key={index}>
              <button className='menu-btn' onClick={() => setSelectedSubPage(index)}
               style={{
                backgroundColor: selectedSubPage === index ? "#f4f5f8" : "",
                color: selectedSubPage === index ? "#000000" : "",
                border: "none",
                outline: "none",
                cursor: "pointer",
                padding: "10px 15px",
                display: "flex",
                alignItems: "center"
              }}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "10px" }}>{item.icon}</span>
                <span>{item.title}</span>
              </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Définition du composant de sous-pages
  const SettingsSubPages = ({ selectedSubPage }: { selectedSubPage: number }) => {
    return (
      <div>
        {/* Afficher le contenu de la sous-page sélectionnée */}
        {subPagesData[selectedSubPage].content}
      </div>
    );
  };
  
export default function Setting() {
    const [selectedSubPage, setSelectedSubPage] = useState<number>(0);


    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                
                <div className="setting-container">
                    <div className="page-info">
                        <div>
                            <h3>Voron  <span> &gt;</span>  settings</h3>
                            <h1>Settings</h1>
                        </div>
                        <div className="page-searcher">
                            <label>Search on page</label>
                            <input type="text" placeholder="Search..." />
                        </div>
                    </div>
                    

                    <div className="setting-feats">
                        <div className='setting-menu'>
                            <SettingsMenu selectedSubPage={selectedSubPage} setSelectedSubPage={setSelectedSubPage} />
                        </div>
                
                        <div className='setting-content'>
                            <SettingsSubPages selectedSubPage={selectedSubPage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

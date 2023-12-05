import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { BsFillShieldLockFill, BsCreditCard } from 'react-icons/bs';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import './Settings.scss';
import SettingAccount from './Settings-pages/setting-account';
import SettingSecurity from './Settings-pages/set-security';
// import SettingNotification from './Settings-pages/set-notif';
import SettingBilling from './Settings-pages/set-billing';

// Interface pour les données de sous-pages
interface SubPage {
    title: string;
    content: JSX.Element;
    icon: JSX.Element;
    key: number;
}

// Tableau de données de sous-pages
const subPagesData: SubPage[] = [
    {
        title: 'Account',
        content: <SettingAccount />,
        icon: <FaUser style={{ fontSize: '20px' }} />,
        key: 0,
    },
    // {
    //     title: 'Notification',
    //     content: <SettingNotification />,
    //     icon: <IoIosNotifications style={{ fontSize: '22px' }} />,
    //     key: 1,
    // },
    {
        title: 'Security',
        content: <SettingSecurity />,
        icon: <BsFillShieldLockFill style={{ fontSize: '22px' }} />,
        key: 1,
    },
    {
        title: 'Billing',
        content: <SettingBilling />,
        icon: <BsCreditCard style={{ fontSize: '22px' }} />,
        key: 2,
    },
    /* {
         title: 'Billing',
         content: <SettingBilling />,
         icon: <BsCreditCard style={{ fontSize: '22px' }} />,
         key: 2,
     }, */
    // {
    //     title: 'Team',
    //     content: <SettingTeam userId={0} userRole="Manager" />, // TOFIX, Idk what role to put
    //     icon: <RiTeamLine style={{ fontSize: '22px' }} />,
    //     key: 2,
    // },
];

// Définition du composant de menu
function SettingsMenu({
    selectedSubPage,
    setSelectedSubPage,
}: {
    selectedSubPage: number;
    setSelectedSubPage: (index: number) => void;
}) {
    return (
        <div className="set-menu">
            <ul>
                {/* Map sur le tableau de données pour créer des boutons de menu */}
                {subPagesData.map((item) => (
                    <li key={item.key}>
                        <button
                            type="button"
                            className="menu-btn"
                            onClick={() => setSelectedSubPage(item.key)}
                            style={{
                                backgroundColor:
                                    selectedSubPage === item.key
                                        ? '#f4f5f8'
                                        : '',
                                color:
                                    selectedSubPage === item.key
                                        ? '#000000'
                                        : '',
                                border: 'none',
                                outline: 'none',
                                cursor: 'pointer',
                                padding: '10px 15px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <span style={{ marginRight: '10px' }}>
                                    {item.icon}
                                </span>
                                <span>{item.title}</span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Définition du composant de sous-pages
function SettingsSubPages({ selectedSubPage }: { selectedSubPage: number }) {
    return (
        <div style={{ fontFamily: 'Poppins-Light' }}>
            {/* Afficher le contenu de la sous-page sélectionnée */}
            {subPagesData[selectedSubPage].content}
        </div>
    );
}

export default function Settings() {
    const [selectedSubPage, setSelectedSubPage] = useState<number>(0);

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="setting-container">
                    <div className="page-info">
                        <h1>Settings</h1>
                    </div>

                    <div className="setting-feats">
                        <div className="setting-menu">
                            <SettingsMenu
                                selectedSubPage={selectedSubPage}
                                setSelectedSubPage={setSelectedSubPage}
                            />
                        </div>

                        <div className="setting-content">
                            <SettingsSubPages
                                selectedSubPage={selectedSubPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

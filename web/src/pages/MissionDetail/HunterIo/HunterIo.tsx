import React, { useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import HunterDomain from './HunterDomain';
import HunterEmailF from './HunterEmailF';
import HunterEmailV from './HunterEmailV';

interface SubPage {
    title: string;
    content: JSX.Element;
    icon: JSX.Element;
    key: number;
}

// Tableau de données de sous-pages
const subPagesData: SubPage[] = [
    {
        title: 'Domain search',
        content: <HunterDomain />,
        icon: <AiIcons.AiOutlineSearch style={{ fontSize: '20px' }} />,
        key: 0,
    },
    {
        title: 'Email Verify',
        content: <HunterEmailV />,
        icon: <AiIcons.AiOutlineScan style={{ fontSize: '20px' }} />,
        key: 1,
    },
    {
        title: 'Email Finder',
        content: <HunterEmailF />,
        icon: <AiIcons.AiOutlineSecurityScan style={{ fontSize: '20px' }} />,
        key: 2,
    },
];

function HunterMenu({
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

function HunterSubPages({ selectedSubPage }: { selectedSubPage: number }) {
    return (
        <div style={{ fontFamily: 'Poppins-Light' }}>
            {/* Afficher le contenu de la sous-page sélectionnée */}
            {subPagesData[selectedSubPage].content}
        </div>
    );
}

export default function HunterIo() {
    const [selectedSubPage, setSelectedSubPage] = useState<number>(0);

    return (
        <div className="setting-feats">
            <div className="setting-menu">
                <HunterMenu
                    selectedSubPage={selectedSubPage}
                    setSelectedSubPage={setSelectedSubPage}
                />
            </div>

            <div className="setting-content">
                <HunterSubPages selectedSubPage={selectedSubPage} />
            </div>
        </div>
    );
}

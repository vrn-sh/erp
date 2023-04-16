import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './team.scss';

interface Group {
    id: number;
    name: string;
    userRole: string;
}

interface UserGroupsProps {
    userId: number;
    userRole: string;
}

interface InviteProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

function InvitePopup({ isOpen, onRequestClose }: InviteProps) {
    const [email, setEmail] = useState('');

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Faites quelque chose avec l'email entré ici, par exemple, l'envoyer à un serveur via une requête HTTP

        // Réinitialiser l'état local de l'email et fermer le popup
        setEmail('');
        onRequestClose();
    };

    return (
        <Modal
            className="popup"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
        >
            <h2>Send a mail to invite a new member</h2>
            <form className="form-popup" onSubmit={handleFormSubmit}>
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Invite</button>
            </form>
        </Modal>
    );
}

function SettingTeam({ userId, userRole }: UserGroupsProps) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [maClasse, setMaClasse] = useState('action-ctn');
    const [width, setWidth] = useState('');

    // const [showPopup, setShowPopup] = useState(false);
    // const [email, setEmail] = useState('');

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
        if (userRole === 'Manager') {
            setMaClasse('action-ctn-plus');
            setWidth('95px');
        } else {
            setMaClasse('action-ctn');
            setWidth('');
        }
    }, [userRole]);

    const handleDeleteGroup = () => {
        // appel de l'API pour supprimer le groupe
    };

    const handleResetGroup = () => {
        // appel de l'API pour réinitialiser le groupe
    };

    return (
        <div className="team-container">
            <span className="left-side">
                <h1>My Team</h1>
            </span>
            {groups.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Group</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => (
                            <tr key={group.id}>
                                <td>{group.name}</td>
                                <td>{group.userRole}</td>
                                <td>
                                    <div className={maClasse} style={{ width }}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                // group.id as param
                                                handleResetGroup()
                                            }
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="button"
                                            className="dlt-btn"
                                            onClick={() =>
                                                // group.id as param
                                                handleDeleteGroup()
                                            }
                                        >
                                            Delete
                                        </button>
                                        {userRole === 'Manager' && (
                                            <button type="button">Add</button>
                                        )}
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
                                <th>Group</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Group 1</td>
                                <td>{userRole}</td>
                                <td>
                                    <div className={maClasse} style={{ width }}>
                                        <button type="button" disabled>
                                            Reset
                                        </button>
                                        <button
                                            type="button"
                                            className="dlt-btn"
                                            disabled
                                        >
                                            Delete
                                        </button>
                                        {userRole === 'Manager' && (
                                            <button type="button" disabled>
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Test Group 2</td>
                                <td>{userRole}</td>
                                <td>
                                    <div className={maClasse} style={{ width }}>
                                        <button type="button" disabled>
                                            Reset
                                        </button>
                                        <button
                                            type="button"
                                            className="dlt-btn"
                                            disabled
                                        >
                                            Delete
                                        </button>
                                        {userRole === 'Manager' && (
                                            <button
                                                type="button"
                                                onClick={handleButtonClick}
                                            >
                                                Add
                                            </button>
                                        )}
                                        <InvitePopup
                                            isOpen={isOpen}
                                            onRequestClose={handleClosePopup}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
export default SettingTeam;

import React, { useState } from 'react';
import Modal from 'react-modal';
import './team.scss';
import Cookies from 'js-cookie';
import { getCookiePart } from '../../../crypto-utils';

interface Group {
    id: number;
    name: string;
    userRole: string;
}

interface UserGroupsProps {
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
            className="team-popup"
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

function SettingTeam({ userRole }: UserGroupsProps) {
    // eslint-disable-next-line
    const [groups, setGroups] = useState<Group[]>([]);
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';

    // const [showPopup, setShowPopup] = useState(false);
    // const [email, setEmail] = useState('');

    const [isOpen, setIsOpen] = useState(false);

    // const handleButtonClick = () => {
    //     setIsOpen(true);
    // };

    const handleClosePopup = () => {
        setIsOpen(false);
    };

    // useEffect(() => {
    //     const fetchGroups = async () => {
    //         const response = await axios.get(`/api/users/${userId}/groups`);
    //         setGroups(response.data);
    //     };
    //     fetchGroups();
    // }, [userId]);

    const handleDeleteGroup = () => {
        // appel de l'API pour supprimer le groupe
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
                                    <div className="action-ctn">
                                        {!isPentester && (
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
                                        )}
                                        {isPentester && (
                                            <button
                                                type="button"
                                                className="dlt-btn"
                                            >
                                                Leave
                                            </button>
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
                                    <div className="action-ctn">
                                        {userRole === 'Manager' && (
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
                                        )}
                                        {userRole === 'Pentester' && (
                                            <button
                                                type="button"
                                                className="dlt-btn"
                                            >
                                                Leave
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Test Group 2</td>
                                <td>{userRole}</td>
                                <td>
                                    <div className="action-ctn">
                                        {userRole === 'Manager' && (
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
                                        )}
                                        {userRole === 'Pentester' && (
                                            <button
                                                type="button"
                                                className="dlt-btn"
                                            >
                                                Leave
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

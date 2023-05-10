import React, { useState } from 'react';
import Feedbacks from '../../../component/Feedback';

export default function SettingSecurity() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleChangePassword = () => {
        // Vérifier que les champs de mot de passe ne sont pas vides et que le nouveau mot de passe correspond à la confirmation
        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
        ) {
            setOpen(true);
            setMessage(
                'Please check all the password were filled correctly',
                'error'
            );
            return;
        }

        // Vérifier que le mot de passe actuel est correct
        // Si oui, modifier le mot de passe et afficher un message de succès
        // Sinon, afficher un message d'erreur
        // Remarque : ceci est un exemple simplifié à des fins de démonstration uniquement
        setOpen(true);
        if (currentPassword === 'currentpassword') {
            setMessage('Changed password successfully!', 'success');
        } else {
            setMessage('The actual password is incorrect.', 'error');
        }
    };

    return (
        <div>
            {open && (
                <Feedbacks
                    mess={message.mess}
                    color={message.color}
                    open={open}
                    close={handleClose}
                />
            )}
            <span className="left-side">
                <h1>Security</h1>
            </span>
            <h3 style={{ textAlign: 'left' }}>Change your password</h3>
            <div className="secu-container">
                <label className="secu-label" htmlFor="currentPassword">
                    Actual password
                </label>
                <input
                    className="secu-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <label className="secu-label" htmlFor="newPassword">
                    New password
                </label>
                <input
                    className="secu-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <label className="secu-label" htmlFor="confirmPassword">
                    Confirm the new password
                </label>
                <input
                    className="secu-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <button
                type="submit"
                onClick={handleChangePassword}
                className="secu-btn"
            >
                Change your password
            </button>
        </div>
    );
}

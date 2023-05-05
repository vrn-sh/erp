import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingSecurity() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = () => {
        // Vérifier que les champs de mot de passe ne sont pas vides et que le nouveau mot de passe correspond à la confirmation
        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
        ) {
            toast.error('Please check all the password were filled correctly');
            return;
        }

        // Vérifier que le mot de passe actuel est correct
        // Si oui, modifier le mot de passe et afficher un message de succès
        // Sinon, afficher un message d'erreur
        // Remarque : ceci est un exemple simplifié à des fins de démonstration uniquement
        if (currentPassword === 'currentpassword') {
            toast.success('Changed password successfully!');
        } else {
            toast.error('The actual password is incorrect.');
        }
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
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

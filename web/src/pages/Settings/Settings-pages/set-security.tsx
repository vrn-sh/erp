import React, { useState } from 'react';

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
            alert('Please check all the password were filled correctly');
            return;
        }

        // Vérifier que le mot de passe actuel est correct
        // Si oui, modifier le mot de passe et afficher un message de succès
        // Sinon, afficher un message d'erreur
        // Remarque : ceci est un exemple simplifié à des fins de démonstration uniquement
        if (currentPassword === 'currentpassword') {
            alert('Changed password successfully!');
        } else {
            alert('The actual password is incorrect.');
        }
    };

    return (
        <div>
            <h1>Security</h1>

            <h2>Change your password</h2>
            <label htmlFor="currentPassword">Actual password :</label>
            <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <br />
            <label htmlFor="newPassword">New password :</label>
            <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <br />
            <label htmlFor="confirmPassword">Confirm the new password :</label>
            <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br />
            <button type="submit" onClick={handleChangePassword}>
                Change your password
            </button>
        </div>
    );
}

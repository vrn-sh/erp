import React, { useState } from 'react';

export default function SettingSecurity() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  
    const handleChangePassword = () => {
      // Vérifier que les champs de mot de passe ne sont pas vides et que le nouveau mot de passe correspond à la confirmation
      if (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
        alert('Veuillez remplir tous les champs de mot de passe et vous assurer que les mots de passe correspondent.');
        return;
      }
  
      // Vérifier que le mot de passe actuel est correct
      // Si oui, modifier le mot de passe et afficher un message de succès
      // Sinon, afficher un message d'erreur
      // Remarque : ceci est un exemple simplifié à des fins de démonstration uniquement
      if (currentPassword === 'currentpassword') {
        alert('Le mot de passe a été modifié avec succès!');
      } else {
        alert('Le mot de passe actuel est incorrect.');
      }
    };
  
    const handleToggleTwoFactor = () => {
      setIsTwoFactorEnabled(!isTwoFactorEnabled);
      // Appeler l'API pour activer/désactiver la validation en deux étapes
      // Remarque : ceci est un exemple simplifié à des fins de démonstration uniquement
      alert(`La validation en deux étapes a été ${isTwoFactorEnabled ? 'désactivée' : 'activée'} avec succès!`);
    };
    return (
       <div>
            <h1>Paramètres de sécurité</h1>

            <h2>Modifier le mot de passe</h2>
            <label htmlFor="currentPassword">Mot de passe actuel :</label>
            <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <br />
            <label htmlFor="newPassword">Nouveau mot de passe :</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <br />
            <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe :</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <br />
            <button onClick={handleChangePassword}>Modifier le mot de passe</button>

            <h2>Validation en deux étapes</h2>
            <label htmlFor="toggleTwoFactor">Activer la validation en deux étapes :</label>
            <input type="checkbox" id="toggleTwoFactor" checked={isTwoFactorEnabled} onChange={handleToggleTwoFactor} />
       </div>
    );
}

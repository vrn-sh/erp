import React, { useEffect, useState, ChangeEvent } from 'react';
import '../Settings.scss';
import Cookies from 'js-cookie';
import SecurityTeam from './securityTeam';
import SecurityUser from './securityUser';
import { useNavigate } from 'react-router-dom';
import ChoosePlanPage from './ChoosePlan';
import { Stripe } from '@stripe/stripe-js';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';



type PlanId = 'basic' | 'freelancer' | 'business'; // Définir les valeurs possibles pour planId

export default function SettingBilling() {
    const [active, setActive] = useState('pwdUser');
    const navigate = useNavigate();
    const role = Cookies.get('Role');
    const [creditCards, setCreditCards] = useState<{ name: string; cardNumber: string }[]>([]);
    const [showAddCardForm, setShowAddCardForm] = useState(false);
    const [newCardInfo, setNewCardInfo] = useState({
        name: '',
        cardNumber: '',
        // Autres champs pour la carte...
    });
    const [showSubscriptionOptions, setShowSubscriptionOptions] = useState(false);

    const handlePayment = (paymentLink: string) => {
        window.location.href = paymentLink;
    };

    const redirectToChoosePlan = () => {
        setShowSubscriptionOptions(true);
    };
    const [lastPayments, setLastPayments] = useState([]);

    const toggleAddCardForm = () => {
        setShowAddCardForm(!showAddCardForm);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCardInfo({
            ...newCardInfo,
            [name]: value,
        });
    };

    const addCreditCard = () => {
        setCreditCards([...creditCards, newCardInfo]);
        setNewCardInfo({
            name: '',
            cardNumber: '',
            // Réinitialiser les autres champs pour la carte...
        });
        toggleAddCardForm();
    };

    const deleteCreditCard = (index: number) => {
        const updatedCards = [...creditCards];
        updatedCards.splice(index, 1);
        setCreditCards(updatedCards);
    };
    

    useEffect(() => {
        const fetchLastPayments = async () => {
            try {
                const response = await fetch('https://api.stripe.com/v1/payment_intents', {
                    method: 'GET',
                    headers: {
                        Authorization: 'sk_test_51ODPTULCQ1iXP3QodJhJQ4aztaAWG26mZTeWRj5rvuPlac9SxRUJ4ZEOT6HKybM7csSYVOiCGouuqE3VtdfT3pJC00Qu1Ps9yG', // Remplacez par votre clé secrète
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLastPayments(data.data);
                } else {
                    throw new Error('Erreur lors de la récupération des paiements');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des paiements:', error);
            }
        };

        fetchLastPayments();
    }, []);


    return (
        <div>
            {/* Section pour afficher le plan actuel */}
            
            <div className="plan-section" style={{ backgroundColor: '#9747FF', display: 'flex', borderRadius:'5px' }}>
                <div style={{ width: '80%'}}>
                    <h2>Plan Actuel</h2>
                    {/* D'autres détails du plan ici */}
                    <p>Nom du plan: Plan Standard</p>
                    <p>Prix: $XX.XX/mois</p>
                </div>
                {/* Bouton pour changer de plan */}
                <div style={{ textAlign:'center', justifyContent:'center'}}>
                    <button style={{width:'150px', height:'70px', backgroundColor:'transparent', border:'solid 2px'}} 
                onClick={redirectToChoosePlan}>
                Changer de Plan
                    </button>
                    <button onClick={() => handlePayment('https://buy.stripe.com/test_aEUaHpc3MfeUc0w8wx')}>
                        Sélectionner Basic
                    </button>
                    <button onClick={() => handlePayment('https://buy.stripe.com/test_6oEdTBd7Q6Io3u0fZ0')}>
                        Sélectionner Freelancer
                    </button>
                    <button onClick={() => handlePayment('https://buy.stripe.com/test_00g3eX8RA4Agd4A288')}>
                        Sélectionner Business
                    </button>
                </div>

            </div>

            
            <div className="order-history-section">
                <h2>Historique des Commandes</h2>
                {/* Tableau pour afficher les commandes */}
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Receipt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Résultats fictifs pour le tableau (4 éléments maximum) */}
                        {[...Array(8)].map((_, index) => (
                            <tr key={index} style={{ display: index < 4 ? 'table-row' : 'none' }}>
                                <td>12/0{index + 1}/2023</td>
                                <td>Type de Commande</td>
                                <td>
                                    <button style={{backgroundColor:'transparent', border:'solid 2px #9747FF', color:'#9747FF'}}>Download</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination */}
                <button className="pagination-arrow" onClick={() => { /* Code pour afficher les éléments suivants */ }}>
                    &darr;
                </button>
            </div>
            <br />

            {/* ... */}

            <div className="payment-method-section">
            <h2>Méthode de Paiement</h2>
            {/* Tableau pour afficher les cartes de crédit */}
            <table>
                {/* ... */}
                <tbody>
                    {creditCards.map((card, index) => (
                        <tr key={index}>
                            <td>{card.name}</td>
                            <td>{card.cardNumber}</td>
                            <td>
                                <button onClick={() => deleteCreditCard(index)}>
                                    Supprimer la Carte
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Bouton pour ajouter une carte */}
            <div style={{width:'150px', height:'50px'}}>
                <button style={{ backgroundColor:'transparent', border:'solid 2px #9747FF', color:'#9747FF'}}onClick={toggleAddCardForm}>
                    Ajouter une Carte
                </button>
            </div>
            {/* Formulaire pour ajouter une carte */}
            {showAddCardForm && (
                <div style={{alignItems:'center', justifyContent:'center'}}>
                    <label>Nom:</label>
                    <input
                        type="text"
                        name="name"
                        value={newCardInfo.name}
                        onChange={handleInputChange}
                    />
                    <label>Numéro de Carte:</label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={newCardInfo.cardNumber}
                        onChange={handleInputChange}
                    />
                     <label>CVC:</label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={newCardInfo.cardNumber}
                        onChange={handleInputChange}
                    />
                    <div style={{width:'150px', height:'50px'}}>
                         <button onClick={addCreditCard}>Ajouter la Carte</button>
                    </div>      
              </div>
            )}
        </div>

        </div>
    );
}

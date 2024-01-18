import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import '../Settings.scss';
import * as AiIcons from 'react-icons/ai';
import Cookies from 'js-cookie';
import { SecondaryButton } from '../../../component/Button';
import subscriptions from '../../../assets/strings/en/subscriptions.json';
import { getCookiePart } from '../../../crypto-utils';

export default function SettingBilling() {
    const cardColors = ['primary-color', 'secondary-color', 'primary-color'];
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [creditCards, setCreditCards] = useState<
        { bank: string; cardNumber: string }[]
    >([]);
    const [showAddCardForm, setShowAddCardForm] = useState(false);
    const [newCardInfo, setNewCardInfo] = useState({
        bank: '',
        cardNumber: '',
        cvc: '',
        // Autres champs pour la carte...
    });
    const [cardBtn, setCardBtn] = useState('');
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';

    const [popup, setPopup] = useState(false);
    const [planPrice, setPlanPrice] = useState('400€ / mois');

    const handlePayment = (paymentLink: string) => {
        window.open(paymentLink, '_blank');
    };

    const redirectToChoosePlan = () => {
        setPopup(true);
    };
    const [lastPayments, setLastPayments] = useState([]);

    const toggleAddCardForm = () => {
        setShowAddCardForm(!showAddCardForm);
        if (cardBtn === '') setCardBtn('None');
        else setCardBtn('');
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
        toggleAddCardForm();
    };

    const deleteCreditCard = (index: number) => {
        const updatedCards = [...creditCards];
        updatedCards.splice(index, 1);
        setCreditCards(updatedCards);
    };

    // const fetchLastPayments = async () => {
    //     await axios
    //         .get('https://api.stripe.com/v1/payment_intents', {
    //             headers: {
    //                 Authorization:
    //                     'sk_test_51ODPTULCQ1iXP3QodJhJQ4aztaAWG26mZTeWRj5rvuPlac9SxRUJ4ZEOT6HKybM7csSYVOiCGouuqE3VtdfT3pJC00Qu1Ps9yG', // Remplacez par votre clé secrète
    //             },
    //         })
    //         .then(async (data) => {
    //             const newData = await data.data;
    //             console.log(newData)
    //             setLastPayments(newData);
    //         })
    //         .catch((e) => {
    //             throw e.message;
    //         });
    // };

    // useEffect(() => {
    //     fetchLastPayments();
    // }, []);

    return (
        <>
            {isPentester ? (
                <div>
                    <h3>Sorry</h3>
                    <p>You don't have access to this page</p>
                </div>
            ) : (
                <div>
                    <div className="billing-plan-section">
                        <div className="billing-plan-actuel">
                            <h3>Your plan</h3>
                            <h2>Plan Standard</h2>
                            <p>Prix: {planPrice}</p>
                        </div>

                        <div
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <button
                                className="change-plan-btn"
                                type="button"
                                onClick={redirectToChoosePlan}
                            >
                                Changer de Plan
                            </button>
                        </div>
                    </div>

                    {/* <div className="order-history-section">
            <h2 style={{textAlign: 'left', marginLeft: '1rem'}}>Historique des Commandes</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Receipt</th>
                    </tr>
                </thead>
                <tbody>
                    // eslint-disable-next-line
                    {[...Array(2)].map((_, index) => (
                        <tr key={index} style={{ display: index < 4 ? 'table-row' : 'none' }}>
                            <td>12/0{index + 1}/2023</td>
                            <td>Type de Commande</td>
                            <td>
                                <button type="button" style={{backgroundColor:'transparent', border:'solid 2px #9747FF', color:'#9747FF'}}>Download</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <br /> */}

                    <div className="billing-card-form-container">
                        <div className="billing-card-header">
                            <h2>Payment method</h2>
                            <button
                                type="button"
                                onClick={toggleAddCardForm}
                                style={{
                                    minWidth: '20px',
                                    backgroundColor: 'transparent',
                                    border: 'solid 1px #9747FF',
                                    color: '#9747FF',
                                    display: cardBtn,
                                }}
                            >
                                Add new card
                            </button>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Bank</th>
                                    <th>Card Number</th>
                                    <th>Actions</th>
                                </tr>
                                {creditCards.map((card, index) => (
                                    <tr>
                                        <td>{card.bank}</td>
                                        <td>{card.cardNumber}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deleteCreditCard(index)
                                                }
                                                style={{
                                                    minWidth: '20px',
                                                    backgroundColor: '#9747FF',
                                                    color: 'white',
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {showAddCardForm && (
                            <div
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div className="input input-medium">
                                    <label>Bank:</label>
                                    <input
                                        required
                                        name="bank"
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="input input-medium">
                                    <label>Card number: </label>
                                    <input
                                        required
                                        name="cardNumber"
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="input input-medium">
                                    <label>CVC:</label>
                                    <input
                                        required
                                        name="cvc"
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={addCreditCard}
                                        style={{ minWidth: '20px' }}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={toggleAddCardForm}
                                        style={{
                                            minWidth: '20px',
                                            backgroundColor: 'transparent',
                                            border: '1px solid #7c44f3',
                                            color: '#7c44f3',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {popup && (
                        <div className="modal-wrapper">
                            <div
                                className="modal-card"
                                style={{ maxWidth: '70%' }}
                            >
                                <div className="modal">
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <div className="plan-subscription-container">
                                            {subscriptions.map(
                                                (subscription, index) => (
                                                    <div
                                                        className={`subscription-card ${
                                                            cardColors[
                                                                index %
                                                                    cardColors.length
                                                            ]
                                                        }`}
                                                        ref={(ref) => {
                                                            cardRefs.current[
                                                                index
                                                            ] = ref;
                                                        }}
                                                    >
                                                        <h2>
                                                            {subscription.type}
                                                        </h2>
                                                        <label>
                                                            €{' '}
                                                            {subscription.price}
                                                        </label>
                                                        <p className="plan-small-des">
                                                            {
                                                                subscription.recurrence
                                                            }
                                                        </p>
                                                        {subscription.service.map(
                                                            (s) => {
                                                                return (
                                                                    <div className="plan-service-container">
                                                                        <AiIcons.AiOutlineCheck
                                                                            style={{
                                                                                color: 'green',
                                                                            }}
                                                                        />
                                                                        <p
                                                                            style={{
                                                                                textAlign:
                                                                                    'left',
                                                                            }}
                                                                        >
                                                                            {s}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                        <button
                                                            className="souscrire-button"
                                                            type="button"
                                                            onClick={() => {
                                                                setPlanPrice(
                                                                    subscription.price_month
                                                                );
                                                                handlePayment(
                                                                    subscription[
                                                                        'stripe-link'
                                                                    ]
                                                                );
                                                            }}
                                                        >
                                                            Select
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <SecondaryButton
                                            variant="outlined"
                                            onClick={() => setPopup(false)}
                                        >
                                            Close
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {'  '}
        </>
    );
}

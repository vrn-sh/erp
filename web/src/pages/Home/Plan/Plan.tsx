import React, { useEffect, useRef, useState } from 'react';
import './Plan.scss';

const subscriptions = [
    {
        type: 'Abonnement',
        price: '400 euros / mois',
        recurrence: 'Par mission',
        hypothesis: 'Entreprises de services de type ESN',
    },
    {
        type: 'Abonnement',
        price: '1050 euros (350 / mois)',
        recurrence: 'Par trimestre',
        hypothesis: '',
    },
    {
        type: 'Abonnement',
        price: '3800 euros (~316 / mois)',
        recurrence: 'Par an',
        hypothesis: '',
    },
];
const cardColors = ['#CAB9FF', '#B299FF', '#A385FF'];

export default function Plan() {
    const [stoppedCards, setStoppedCards] = useState([]);

    const cardRefs = useRef([]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const handleIntersect = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !stoppedCards.includes(entry.target.dataset.index)) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver((entries) => handleIntersect(entries, observer), observerOptions);

        cardRefs.current.forEach((card, index) => {
            observer.observe(card);
        });

        return () => {
            observer.disconnect();
        };
    }, [stoppedCards]);


    return (
        <div id="plan" className="plan">
            <h1 className='title'>Ready to start your journey ?</h1>
            <div className="subscription-container">
            {subscriptions.map((subscription, index) => (
                <div
                    className={`subscription-card ${stoppedCards.includes(index) ? 'stopped' : ''}`}
                    key={index}
                    ref={(ref) => (cardRefs.current[index] = ref)}
                    style={{ backgroundColor: cardColors[index] }}
                >
                <h2>{subscription.type}</h2>
                <p>{subscription.price}</p>
                <p>{subscription.recurrence}</p>
                <div className='button-with'>    
                    <button className="souscrire-button">S'ouscrire</button>
                </div>
                <p>{subscription.hypothesis}</p>
                </div>
            ))}
            </div>
            <h3 className='pro'>Besoin d'un contrat pro ?</h3>
            <div className='button-with'>
                <button className="contact-button">Contacter Voron</button>
            </div>
        </div>
    );
}
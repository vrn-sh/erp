import React, { useEffect, useRef, useState } from 'react';
import './Plan.scss'; // Import your SCSS file
import subscriptions from '../../../assets/strings/en/subscriptions.json';

function CustomLink({
    to,
    children,
    className,
    ...props
}: {
    to: string;
    children: string;
    className: string;
}) {
    const buttonStyle = {
        fontFamily: 'Poppins',
    };

    return (
        <button className={className} onClick={() => window.location.href = to} style={buttonStyle} {...props}>
            {children}
        </button>
    );
}

export default function Plan() {
    const [stoppedCards, setStoppedCards] = useState<number[]>([]);
    const cardColors = ['primary-color', 'secondary-color', 'tertiary-color']; // Define your color classes

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                // Intersection Observer logic remains the same
            });
        };

        const observer: IntersectionObserver = new IntersectionObserver((entries) => handleIntersect(entries, observer), observerOptions);

        cardRefs.current.forEach((card, index) => {
            if (card) {
                observer.observe(card);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [stoppedCards]);

    return (
        <div id="plan" className="plan-title">
            <h1 className='plan-title'>Ready to start your journey ?</h1>
            <div className="plan-subscription-container">
                {subscriptions.map((subscription, index) => (
                    <div
                        className={`subscription-card ${stoppedCards.includes(index) ? 'stopped' : ''} ${cardColors[index % cardColors.length]}`}
                        key={index}
                        ref={(ref) => (cardRefs.current[index] = ref)}
                    >
                        <h2>{subscription.type}</h2>
                        <p>{subscription.price}</p>
                        <p>{subscription.recurrence}</p>
                        <div className='button-with'>
                            <button className="souscrire-button">Souscrire</button>
                        </div>
                        <p>{subscription.hypothesis}</p>
                    </div>
                ))}
            </div>
            <h3 className='pro'>Besoin d'un contrat pro ?</h3>
            <div className='button-with'>
                <CustomLink to="#contact" className="contact-button">Contacter Voron</CustomLink>
            </div>
        </div>
    );
}

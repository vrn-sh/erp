import React, { useEffect, useRef, useState } from 'react';
import './Plan.scss';
import * as AiIcons from 'react-icons/ai';
import subscriptions from '../../../assets/strings/en/subscriptions.json';

export default function Plan() {
    const [stoppedCards, setStoppedCards] = useState<number[]>([]);
    const cardColors = ['primary-color', 'secondary-color', 'primary-color'];

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const handleIntersect = (
            entries: IntersectionObserverEntry[],
            observer: IntersectionObserver
        ) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                // Intersection Observer logic remains the same
            });
        };

        const observer: IntersectionObserver = new IntersectionObserver(
            (entries) => handleIntersect(entries, observer),
            observerOptions
        );

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
            <h1 className="plan-title">Ready to start your journey ?</h1>
            <div className="plan-subscription-container">
                {subscriptions.map((subscription, index) => (
                    <div
                        className={`subscription-card ${
                            cardColors[index % cardColors.length]
                        }`}
                        ref={(ref) => {
                            cardRefs.current[index] = ref;
                        }}
                    >
                        <h2>{subscription.type}</h2>
                        <label>€ {subscription.price}</label>
                        <p className="plan-small-des">
                            {subscription.recurrence}
                        </p>
                        {subscription.service.map((s) => {
                            return (
                                <div className="plan-service-container">
                                    <AiIcons.AiOutlineCheck
                                        style={{ color: 'green' }}
                                    />
                                    <p style={{ textAlign: 'left' }}>{s}</p>
                                </div>
                            );
                        })}
                        <button className="souscrire-button" type="button">
                            Souscrire
                        </button>
                    </div>
                ))}
            </div>
            <h5 className="plan-pro">Need a plan more personalised?</h5>
            <button
                type="button"
                className="plan-contact-button"
                onClick={() => {
                    window.location.href = '#contact';
                }}
            >
                Contact us
            </button>
        </div>
    );
}

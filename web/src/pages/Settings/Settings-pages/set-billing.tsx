import React from 'react';
import './billing.scss';

export default function SettingBilling() {
    return (
        <div>
            <div className="first-container">
                <div className="small-card">
                    Current Monthly Bill
                    <h1>0$</h1>
                    <a href="#">Switch to yearly billing</a>
                </div>
                <div className="small-card">
                    Next Payment due
                    <h1>0$</h1>
                    <a href="#">View payment history</a>
                </div>
                <div className="small-card">
                    Payment Informations <span> &gt;</span>
                    <h1>____</h1>
                    <a href="#">Update Payment infos</a>
                </div>
            </div>

            <div className="sec-container">
                <h1>Voron Pro</h1>
                <h1>-------------------------------------------</h1>
                <div>
                    - Unlimited public/private repos <br />
                    - Unlimited collaborators <br />
                    - 3,000 Actions minutes/month <br />
                    - 2GB of Packages storage <br />
                    - 180 core-hours of Codespaces compute <br />
                    - 20GB of Codespaces storage <br />
                </div>
            </div>
        </div>
    );
}

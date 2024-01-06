import React, { useEffect, useState } from 'react';
import '../Settings.scss';
import Cookies from 'js-cookie';
import SecurityTeam from './securityTeam';
import SecurityUser from './securityUser';

export default function SecurityDetail() {
    const [active, setActive] = useState('pwdUser');
    const role = Cookies.get('Role');

    const handleClick = (event: any) => {
        setActive(event.target.id);
    };

    const getSubSecurityDetail = () => {
        if (active === 'pwdUser') {
            return <SecurityUser />;
        }
        if (active === 'pwdTeam') {
            return <SecurityTeam />;
        }
        return null;
    };

    return (
        <div>
            <span className="left-side">
                <h1>Security</h1>
            </span>
            {role === '2' && (
                <>
                    <div className="subHeader">
                        <div className="submenu-security">
                            <button
                                key={1}
                                id="pwdUser"
                                type="button"
                                className={
                                    active === 'pwdUser' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Change your password
                            </button>
                            <button
                                key={2}
                                id="pwdTeam"
                                type="button"
                                className={
                                    active === 'pwdTeam' ? 'active' : undefined
                                }
                                onClick={handleClick}
                            >
                                Change Team Password
                            </button>
                        </div>
                    </div>
                    {getSubSecurityDetail()}
                </>
            )}
            {role === '1' && <SecurityUser />}
            {role === '3' && <SecurityUser />}

        </div>
    );
}

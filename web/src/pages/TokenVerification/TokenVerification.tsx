import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { getCookiePart } from '../../crypto-utils';

function PrivateRoute() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getCookiePart(Cookies.get('Token')!, 'token');
        const expirationDate = Cookies.get('ExpirationDate');

        if (!token) {
            navigate('/login');
        } else {
            // Si un token est présent et la date d'expiration n'est pas dépassée, autoriser l'accès à la route
            // Vous pouvez effectuer d'autres actions ici, si nécessaire
        }
    }, [navigate]);

    return <Outlet />;
}

export default PrivateRoute;

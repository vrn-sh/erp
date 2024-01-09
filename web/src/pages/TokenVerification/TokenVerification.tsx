import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios, { Method } from 'axios';

const API_URL = 'http://127.0.0.1:8000/'; // Remplacez par votre URL d'API

const authErrorMessages = [
  'Invalid token.',
  'User is not active',
  'The token is expired.',
  'Authentication credentials were not provided.',
];

interface ErrorResponse {
  detail: string;
}

export const genericRequest = async (
    httpVerb: Method,
    route: string,
    body: Record<string, any> = {},
    navigate: ReturnType<typeof useNavigate>, // Ajout de navigate en tant qu'argument
  ): Promise<any> => {
    try {
      const response = await axios({
        method: httpVerb,
        url: `${API_URL}${route}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${Cookies.get('Token')}`,
        },
        data: body,
      });
      return response.data;
    } catch (err: any) {
      if (
        err.response &&
        err.response.data &&
        'detail' in err.response.data &&
        authErrorMessages.includes((err.response.data as ErrorResponse).detail)
      ) {
        navigate('/login'); // Redirection vers la page de connexion en cas d'erreur d'authentification
        console.error('Erreur d\'authentification:', err.response.data.detail);
      }
      throw err; // Relancer l'erreur pour une gestion supplémentaire si nécessaire
    }
  };
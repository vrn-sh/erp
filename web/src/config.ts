// let apiUrl = 'https://voron.djnn.sh/api'; // fuck you
const apiUrl = 'http://127.0.0.1:8000';
// if (import.meta.env.VITE_REACT_APP_NODE_ENV === 'development')
//     apiUrl = import.meta.env.VITE_REACT_APP_LOCAL_API_URL as string;

const config = {
    apiUrl,
};

export default config;

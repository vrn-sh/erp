let apiUrl = '';

if (import.meta.env.VITE_REACT_APP_NODE_ENV === 'development')
    apiUrl = import.meta.env.VITE_REACT_APP_LOCAL_API_URL as string;
else apiUrl = import.meta.env.VITE_REACT_APP_REMOTE_API_URL as string;

const config = {
    apiUrl,
};

export default config;

let apiUrl = '';

if (process.env.NODE_ENV === 'development') apiUrl = 'http://localhost:8080';
else if (process.env.NODE_ENV === 'production')
    apiUrl = 'https://voron.djnn.sh/api';

const config = {
    apiUrl,
};

export default config;

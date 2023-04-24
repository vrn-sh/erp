let apiUrl = '';

if (import.meta.env.NODE_ENV === 'development')
    apiUrl = import.meta.env.LOCAL_API_URL as string;
else if (import.meta.env.NODE_ENV === 'production')
    apiUrl = import.meta.env.REMOTE_API_URL as string;

const config = {
    apiUrl,
};

export default config;

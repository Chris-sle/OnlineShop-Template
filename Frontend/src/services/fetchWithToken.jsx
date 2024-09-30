import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchWithToken = async (url, method = "GET", data = null) => {
    const token = Cookies.get('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
        const config = {
            method,
            url: `https://localhost:3000${url}`,
            headers,
        };

        // Conditionally include data only for applicable HTTP methods
        if (method !== 'GET' && method !== 'DELETE' && data !== null) {
            config.data = data;
        }

        const response = await axios(config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('API error:', error);
        throw new Error('Could not fetch data');
    }
}

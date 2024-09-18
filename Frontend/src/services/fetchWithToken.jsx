import axios from 'axios';
import Cookies from 'js-cookie'

export const fetchWithToken = async (url, method = "GET", data = null) =>{
    const token = Cookies.get('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
        const response = await axios({
            method,
            url: `https://localhost:3000${url}`,
            data,
            headers,
        });

        return response.data;
    } catch (error) {
        console.error('API error:', error);
        throw new Error('Could not fetch data');
    }
}
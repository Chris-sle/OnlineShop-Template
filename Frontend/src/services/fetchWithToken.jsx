import axios from 'axios';
import Cookies from 'js-cookie'

export const fetchWithToken = async (url, method = "GET", data = null) =>{
    const token = Cookies.get('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }) // Ensure token is used
    };

    try {
        const response = await axios({
            method,
            url: `https://localhost:3000${url}`,
            data,
            headers: {
                'Content-Type': 'application/json',
                ...headers // Include authorization headers if available
            },
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('API error:', error);
        throw new Error('Could not fetch data');
    }
}
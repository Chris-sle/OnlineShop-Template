import axios from 'axios';
import Cookies from 'js-cookie';

// Adjust the function to ensure URL and method are strings
export const publicFetch = async ({ URL, method = 'GET', data = null }) => {
    // Ensure URL and method are strings
    if (typeof URL !== 'string' || typeof method !== 'string') {
        throw new Error('Invalid parameters: URL and method should be strings');
    }

    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios({
            method,
            url: `https://localhost:3000${URL}`,
            data: method === 'GET' || method === 'DELETE' ? undefined : data, // Avoid sending data for GET or DELETE
            headers,
        });

        return response.data; // Return the response data
    } catch (error) {
        console.error('API error:', error);
        throw new Error('Could not fetch data'); // Pass the error up to the calling function
    }
};

import React from 'react';

export const publicFetch = async ({ URL, method = 'GET' }) => {
    if (typeof URL !== 'string' || typeof method !== 'string') {
        console.error('Invalid parameters: URL and method should be strings');
        return;
    }

    try {
        const response = await fetch(`https://localhost:3000${URL}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching from ${URL}:`, error);
        return null;
    }
};
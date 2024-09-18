import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check cookies for an existing token on mount
        const storedToken = Cookies.get('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = (token) => {
        setToken(token);
        Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });
    };

    const logout = () => {
        setToken(null);
        Cookies.remove('token');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
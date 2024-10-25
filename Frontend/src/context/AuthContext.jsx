import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Check cookies for an existing token on mount
        const storedToken = Cookies.get('token');
        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                setToken(storedToken);
                setUserId(decodedToken.id);
                setUserEmail(decodedToken.email);
                setUserRole(decodedToken.role); // Ensure you set the user role correctly
            } catch (error) {
                console.error('Token decoding failed:', error.message);
                Cookies.remove('token');
            }
        }
    }, []);

    const login = (token) => {
        setToken(token);
        Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });

        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
        setUserEmail(decodedToken.email);
        setUserRole(decodedToken.role);
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        setUserEmail(null);
        setUserRole(null);
        Cookies.remove('token');
    };

    return (
        <AuthContext.Provider value={{ token, userId, userEmail, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
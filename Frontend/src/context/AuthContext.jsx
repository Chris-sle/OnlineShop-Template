import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null)
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Check cookies for an existing token on mount
        const storedToken = Cookies.get('token');
        if (storedToken) {
            try {
                setToken(storedToken);
                const decodedToken = jwtDecode(storedToken);
                setUserId(decodedToken.id); 
                setUserEmail(decodedToken.email);
                setUserRole(decodedToken.role);
                console.log('Role at mount:', decodedToken.role);
            } catch (error) {
                console.error('Token decoding failed:', error.message);
                // Handle the error (e.g. remove the invalid token from cookies)
                Cookies.remove('token');
            }
        }
    }, []);

    const login = (token) => {
        setToken(token);
        Cookies.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });

        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
        setUserEmail(decodedToken.email)
        setUserRole(decodedToken.role);
        console.log('Decoded Token on login:', decodedToken);
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        setUserEmail(null);
        setUserRole(null);
        Cookies.remove('token');
    };

    return (
        <AuthContext.Provider value={{ token, userRole, login, logout }}>
            {children}
        </AuthContext.Provider> 
    );
};
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        // Optionally, redirect to a homepage or login page.
        // e.g. window.location.href = '/login';
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
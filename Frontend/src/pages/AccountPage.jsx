import React from 'react';
import Login from '../components/Authentication/Login.jsx'

const AccountPage = () => {
    const { user } = useContext(AuthContext);
    
    return (
        <div>
            AccountPage!
            <Login />
        </div>
    );
};

export default AccountPage;
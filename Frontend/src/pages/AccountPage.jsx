import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import Login from '../components/Authentication/Login.jsx';
import Register from '../components/Authentication/Register.jsx';
import AccountInfo from '../components/Account/AccountInfo.jsx';
import LogoutButton from '../components/Authentication/LogoutButton.jsx';

const AccountPage = () => {
    const { token } = useContext(AuthContext);

    return (
        <main className='container d-flex justify-content-center align-items-center text-center'>
            {token ? (
                <div>
                    <AccountInfo />
                    <LogoutButton />
                </div>
            ) : (
                <div className='row'>
                    <div className='col-md-auto border-end'>
                        <h2 className='h2'>Login</h2>
                        <Login />
                    </div>
                    <div className='col-md-auto '>
                        <h2 className='h2'>Register</h2>
                        <Register />
                    </div>
                </div>
            )}
        </main>
    );
};

export default AccountPage;
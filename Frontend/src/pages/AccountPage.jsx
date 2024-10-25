import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import AccountInfo from '../components/Account/AccountInfo.jsx';
import UserInfoForm from '../components/Account/UserInfoForm.jsx'; // New import for UserInfoForm
import UserReviews from '../components/Account/UserReviews.jsx';
import UserOrders from '../components/Account/UserOrders.jsx';
import LogoutButton from '../components/Authentication/LogoutButton.jsx';

const AccountPage = () => {
    const { token } = useContext(AuthContext);
  
    return (
        <main className='container'>
            <h1 className='h1 text-center'>Account Page</h1>
            {token ? (
                <div className='row'>
                    <UserInfoForm />
                    <AccountInfo />
                    <UserReviews />
                    <UserOrders />
                    <LogoutButton />
                </div>
            ) : (
                <p>Please log in to access your account.</p>
            )}
        </main>
    );
};

export default AccountPage;

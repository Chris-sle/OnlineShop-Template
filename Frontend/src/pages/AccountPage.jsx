import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import AccountInfo from '../components/Account/AccountInfo.jsx';
import UserInfoForm from '../components/Account/UserInfoForm.jsx'; // New import for UserInfoForm
import UserReviews from '../components/Account/UserReviews.jsx';
import LogoutButton from '../components/Authentication/LogoutButton.jsx';
import { fetchWithToken } from '../services/fetchWithToken'; // For fetching user info

const AccountPage = () => {
    const { token } = useContext(AuthContext);
  
    // User Information State
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user information
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) {
                try {
                    const data = await fetchWithToken('/users/userinfo', 'GET'); // Adjusted to the new route
                    setUserInfo(data);
                } catch (error) {
                    setError('Failed to fetch user information.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // No token, just stop loading
            }
        };

        fetchUserInfo();
    }, [token]);

    if (loading) return <p>Loading account information ...</p>;
    if (error) return <p>{error}</p>;

    // Handle user info updates
    const handleEditSubmit = async (userData) => {
        try {
            await fetchWithToken('/users/userinfo', 'PUT', userData); // Send updated info
            const updatedData = await fetchWithToken('/users/userinfo', 'GET'); // Fetch updated data again
            setUserInfo(updatedData);
        } catch (error) {
            setError('Failed to update user information.');
        }
    };

    return (
        <main className='container'>
            <h1 className='h1 text-center'>Account Page</h1>
            {token ? (
                <div className='row'>
                    <UserInfoForm
                        userInfo={userInfo}
                        handleEditSubmit={handleEditSubmit}
                    />
                    <AccountInfo userInfo={userInfo} />
                    <UserReviews />
                    <LogoutButton />
                </div>
            ) : (
                <p>Please log in to access your account.</p>
            )}
        </main>
    );
};

export default AccountPage;

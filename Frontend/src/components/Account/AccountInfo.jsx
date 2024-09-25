import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';

const AccountInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await fetchWithToken('/users/me', 'GET');
                setUserInfo(data);
            } catch (error) {
                setError('Failed to fetch user information.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) return <p>Loading account information ...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='container'>
            <div>
                <h1>Account Information</h1>
                <p>Email: {userInfo.user_email}</p>
                
                {/* Display other account-related info as needed */}
            </div>
        </div>
    )
};

export default AccountInfo;
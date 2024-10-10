import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import UserInfoForm from './UserInfoForm';

const AccountInfo = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await fetchWithToken('/users/userinfo', 'GET');
                setUserInfo(data);
                setName(data.name || '');
                // Format date_of_birth correctly for the input
                setDateOfBirth(data.date_of_birth ? data.date_of_birth.split('T')[0] : ''); // '1999-12-31'
                setAddress(data.address || '');
                setCity(data.city || '');
                setZipCode(data.zipCode || '');
                setCountry(data.country || '');
            } catch (error) {
                setError('Failed to fetch user information.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchWithToken('/users/userinfo', 'PUT', {
                name,
                date_of_birth: dateOfBirth,
                address,
                city,
                zipCode,
                country,
            });

            const updatedData = await fetchWithToken('/users/userinfo', 'GET');
            setUserInfo(updatedData);
            setName(updatedData.name || '');
            setDateOfBirth(updatedData.date_of_birth ? updatedData.date_of_birth.split('T')[0] : ''); // '1999-12-31'
            setAddress(updatedData.address || '');
            setCity(updatedData.city || '');
            setZipCode(updatedData.zipCode || '');
            setCountry(updatedData.country || '');
        } catch (error) {
            setError('Failed to update user information.');
        }
    };

    if (loading) return <p>Loading account information ...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='container'>
            <h1>Account Information</h1>
            <UserInfoForm
                name={name}
                setName={setName}
                dateOfBirth={dateOfBirth}
                setDateOfBirth={setDateOfBirth}
                address={address}
                setAddress={setAddress}
                city={city}
                setCity={setCity}
                zipCode={zipCode}
                setZipCode={setZipCode}
                country={country}
                setCountry={setCountry}
                handleEditSubmit={handleEditSubmit}
                userInfo={userInfo} // Pass userInfo for placeholders
            />
            <div className="mt-4">
                <h3>Account Security</h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        Email: {userInfo.user_email}
                        <button className="btn btn-link" onClick={() => {/* Add logic for editing email here */ }}>Edit</button>
                    </li>
                    <li className="list-group-item">
                        Password: ************
                        <button className="btn btn-link" onClick={() => {/* Logic to open password change modal or component */ }}>Edit</button>
                    </li>
                </ul>
            </div>
        </div>
    )
};

export default AccountInfo;
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchWithToken } from "../../services/fetchWithToken";

const UserInfoForm = () => {
    const { token } = useContext(AuthContext); // Ensure you're accessing the Auth context
    const [loading, setLoading] = useState(true); // Manage loading state
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            setLoading(true); // Start loading
            if (token) {
                try {
                    const data = await fetchWithToken('/users/userinfo', 'GET');
                    setName(data.name || '');
                    setEmail(data.user_email || '');
                    setDateOfBirth(data.date_of_birth ? data.date_of_birth.split('T')[0] : '');
                    setAddress(data.address || '');
                    setCity(data.city || '');
                    setZipCode(data.zipCode || '');
                    setCountry(data.country || '');
                } catch (error) {
                    setError('Failed to fetch user information.');
                    console.error(error);
                } finally {
                    setLoading(false); // End loading
                }
            }
        };

        fetchUserInfo();
    }, [token]);

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh on form submit
        const userData = { 
            name,
            email,
            date_of_birth: dateOfBirth,
            address,
            city,
            zipCode,
            country
        };

        try {
            await fetchWithToken('/users/userinfo', 'PUT', userData); // Send updated info
            const updatedData = await fetchWithToken('/users/userinfo', 'GET'); // Fetch updated data again
            setUserInfo(updatedData);
            alert("User information updated successfully!");
        } catch (error) {
            setError('Failed to update user information.');
            console.error(error);
        }
    };

    if (loading) return <p>Loading user information...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <form onSubmit={handleFormSubmit} className='form'>
            <div className='mb-3'>
                <label className='form-label'>Name</label>
                <input
                    type="text"
                    className='form-control'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Enter your name'
                    required
                />
            </div>
            <div className='mb-3'>
                <label className='form-label'>Email</label>
                <input
                    type="email"
                    className='form-control'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    required
                />
            </div>
            <div className='mb-3'>
                <label className='form-label'>Date of Birth</label>
                <input
                    type="date"
                    className='form-control'
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                />
            </div>
            <div className='mb-3'>
                <label className='form-label'>Address</label>
                <input
                    type="text"
                    className='form-control'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='Enter your address'
                    required
                />
            </div>
            <div className='mb-3'>
                <label className='form-label'>City</label>
                <input
                    type="text"
                    className='form-control'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder='Enter your city'
                    required
                />
            </div>
            <div className='mb-3'>
                <label className='form-label'>Zip Code</label>
                <input
                    type="text"
                    className='form-control'
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder='Enter your zip code'
                    required
                />
            </div>
            <div className='mb-3'>
                <label className='form-label'>Country</label>
                <input
                    type="text"
                    className='form-control'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder='Enter your country'
                    required
                />
            </div>
            <button type="submit" className='btn btn-success'>Save Changes</button>
        </form>
    );
};

export default UserInfoForm;

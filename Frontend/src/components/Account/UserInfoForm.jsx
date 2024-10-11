import React, { useState, useEffect } from "react";

const UserInfoForm = ({ userInfo, handleEditSubmit }) => {
    const [name, setName] = useState(userInfo.name || '');
    const [dateOfBirth, setDateOfBirth] = useState(userInfo.date_of_birth ? userInfo.date_of_birth.split('T')[0] : '');
    const [address, setAddress] = useState(userInfo.address || '');
    const [city, setCity] = useState(userInfo.city || '');
    const [zipCode, setZipCode] = useState(userInfo.zipCode || '');
    const [country, setCountry] = useState(userInfo.country || '');

    useEffect(() => {
        // Update fields if userInfo changes (optional)
        setName(userInfo.name || '');
        setDateOfBirth(userInfo.date_of_birth ? userInfo.date_of_birth.split('T')[0] : '');
        setAddress(userInfo.address || '');
        setCity(userInfo.city || '');
        setZipCode(userInfo.zipCode || '');
        setCountry(userInfo.country || '');
    }, [userInfo]);

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent page refresh on form submit
        handleEditSubmit({ // Pass updated data back to AccountPage
            name,
            date_of_birth: dateOfBirth,
            address,
            city,
            zipCode,
            country,
        });
    };

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

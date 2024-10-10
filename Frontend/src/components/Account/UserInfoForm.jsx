import React from "react";

const UserInfoForm = ({
    name,
    setName,
    dateOfBirth,
    setDateOfBirth,
    address,
    setAddress,
    city,
    setCity,
    zipCode,
    setZipCode,
    country,
    setCountry,
    handleEditSubmit,
    userInfo
}) => {
    return (
        <form onSubmit={handleEditSubmit} className='form'>
            <div className='mb-3'>
                <label className='form-label'>Name</label>
                <input
                    type="text"
                    className='form-control'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={userInfo.name || 'Enter your name'}
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
                    placeholder={userInfo.address || 'Enter your address'}
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
                    placeholder={userInfo.city || 'Enter your city'}
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
                    placeholder={userInfo.zipCode || 'Enter your zip code'}
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
                    placeholder={userInfo.country || 'Enter your country'}
                    required
                />
            </div>
            <button type="submit" className='btn btn-success'>Save Changes</button>
        </form>
    );
};

export default UserInfoForm;

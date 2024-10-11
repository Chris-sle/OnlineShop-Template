import React, { useState } from 'react';
import { publicFetch } from '../../services/PublicFetch'; // Ensure you're using publicFetch

const Register = ({ onRegister }) => {
    const [userEmail, setEmail] = useState('');
    const [userPassword, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        // Call the onRegister function passed from LoginPage
        onRegister(userEmail, userPassword);
        // Add some regex rules.
    };

    return (
        <div className='container'>
            <form onSubmit={handleRegister}>
                <div className='form-float'>
                    <input
                        className='form-control'
                        type="email"
                        value={userEmail}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                    />
                    <input
                        className='form-control'
                        type="password"
                        value={userPassword}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                    />
                </div>
                <button className="btn btn-primary" type="submit">Register</button>
                {message && <p className='text-danger'>{message}</p>} {/* Error message display */}
            </form>
        </div>
    );
};

export default Register;

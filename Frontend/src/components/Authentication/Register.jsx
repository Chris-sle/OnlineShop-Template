import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { publicFetch } from '../../services/PublicFetch'; // Ensure you're using publicFetch

const Register = () => {
    const { login } = useContext(AuthContext);
    const [userEmail, setEmail] = useState('');
    const [userPassword, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await publicFetch({ URL: '/users/register', method: 'POST', data: { userEmail, userPassword } });
            const { token } = response; // Assuming the response contains a token
            if (token) {
                login(token); // Log in the user with the new token
                setMessage('User registered successfully.');
            } else {
                setMessage('Registration successful, but no token returned.');
            }
        } catch (error) {
            console.error('Registration failed:', error.message);
            setMessage('Registration failed. Please try again.');
        }
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
                {message && <p className='p'>{message}</p>}
            </form>
        </div>
    );
};

export default Register;

import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchWithToken } from '../../services/fetchWithToken';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [userEmail, setEmail] = useState('');
    const [userPassword, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await fetchWithToken('/users/login', 'POST', { userEmail, userPassword });
            login(data.token); // Store the token using the context function
            console.log('Login successful 🟢');
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={userEmail}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
            />
            <input
                type="password"
                value={userPassword}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
            />
            <button type="submit">Log In</button>
        </form>
    );
};

export default Login;

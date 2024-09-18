import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchWithToken } from '../../services/fetchWithToken';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const  data = await fetchWithToken('/auth/login', 'POST', {email, password})
            login(data.token); // Store the token using the context function
        } catch {
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Log In</button>
        </form>
    );
};

export default Login;
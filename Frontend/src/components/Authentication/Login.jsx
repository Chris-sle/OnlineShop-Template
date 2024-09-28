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
            console.log(data.token)
            login(data.token); // Store the token using the context function
            console.log('Login successful 🟢');
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
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
                <button className="btn btn-primary" type="submit">Log In</button>
            </form>
        </div>
    );
};

export default Login;

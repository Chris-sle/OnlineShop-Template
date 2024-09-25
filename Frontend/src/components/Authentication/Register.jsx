import React, { useContext, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const { login } = useContext(AuthContext)
    const [userEmail, setEmail] = useState('');
    const [userPassword, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchWithToken('/users/register', 'POST', {userEmail, userPassword });
            const { token } = response;
            login(token);
            setMessage('User registered successfully.');
            console.log(response)
        } catch (error) {
            console.error('Registration failed: ', error.message);
            setMessage('Registration failed. Please try again.')
        }
    };

    return(
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
                <button type="submit" className='btn btn-primary'>Register</button>
                {message && <p className='p'>{message}</p>}
            </form>
        </div>
    )
};

export default Register;
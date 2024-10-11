import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { fetchWithToken } from '../services/fetchWithToken';
import { publicFetch } from '../services/PublicFetch';
import { useNavigate } from 'react-router-dom'; // For navigation
import Login from '../components/Authentication/Login';
import Register from '../components/Authentication/Register';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate  = useNavigate(); // For navigation
    const [message, setMessage] = useState('');

    // Handle login logic
    const handleLogin = async (userEmail, userPassword) => {
        try {
            const data = await fetchWithToken('/users/login', 'POST', { userEmail, userPassword });
            login(data.token); // Store the token using the context function
            navigate('/account'); // Redirect to the AccountPage
        } catch (error) {
            setMessage('Login failed: ' + error.message);
        }
    };

    // Handle registration logic
    const handleRegister = async (userEmail, userPassword) => {
        try {
            const response = await publicFetch({ URL: '/users/register', method: 'POST', data: { userEmail, userPassword } });
            const { token } = response;

            if (token) {
                login(token); // Log the user in
                history.push('/account'); // Redirect to the AccountPage
            } else {
                setMessage('Registration successful, but no token returned.');
            }
        } catch (error) {
            setMessage('Registration failed: ' + error.message);
        }
    };

    return (
        <main className='container d-flex justify-content-center align-items-center text-center'>
            <div className='row'>
                <div className='col-md-auto border-end'>
                    <h2 className='h2'>Login</h2>
                    <Login onLogin={handleLogin} />
                    {message && <p className='text-danger'>{message}</p>}
                </div>
                <div className='col-md-auto'>
                    <h2 className='h2'>Register</h2>
                    <Register onRegister={handleRegister} />
                    {message && <p className='text-danger'>{message}</p>}
                </div>
            </div>
        </main>
    );
};

export default LoginPage;

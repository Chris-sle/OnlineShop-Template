import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [userEmail, setEmail] = useState('');
    const [userPassword, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(userEmail, userPassword); // Call the onLogin function passed from LoginPage
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

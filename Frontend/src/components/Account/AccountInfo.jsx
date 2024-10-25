import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AccountInfo = () => {
    const { userEmail } = useContext(AuthContext)
    
    return (
        <div className='container'>
            <h1>Account Security</h1>
            <ul className="list-group">
                <li className="list-group-item">
                    Email: {userEmail}
                    <button className="btn btn-link" onClick={() => {/* Logic for editing email */}}>Edit</button>
                </li>
                <li className="list-group-item">
                    Password: ************
                    <button className="btn btn-link" onClick={() => {/* Logic for editing password */}}>Edit</button>
                </li>
            </ul>
        </div>
    );
};

export default AccountInfo;

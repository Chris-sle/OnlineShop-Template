import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="container">
                <ul className='navbar-nav'>
                    <li className='nav-item'>
                        <Link to="/" className="nav-link">Home</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/products" className="nav-link">Products</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/account" className="nav-link">Account</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to="/admin" className="nav-link">Admin</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
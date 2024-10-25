import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LogoutButton from '../Authentication/LogoutButton';
import CartDropdown from '../Cart/CartDropdown';

const Navbar = () => {
    const { userRole, token } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Shop</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/products" className="nav-link">Products</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <CartDropdown />
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span className="material-icons">
                                    person
                                </span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                                {token ? (
                                    <>
                                        <li>
                                            <Link to="/account" className="dropdown-item">Account</Link>
                                        </li>
                                        {(userRole === 'seller' || userRole === 'admin') && (
                                            <li>
                                                <Link to="/seller" className="dropdown-item">Seller</Link>
                                            </li>
                                        )}
                                        {userRole === 'admin' && (
                                            <li>
                                                <Link to="/admin" className="dropdown-item">Admin</Link>
                                            </li>
                                        )}
                                        <li className='dropdown-item align-items-center'>
                                            <LogoutButton />
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link to="/login" className="dropdown-item">Login</Link>
                                    </li>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const CustomerInfoModal = ({ showModal, handleClose, customerInfo, handleInputChange, handleOrderSubmit }) => {
    const { token } = useContext(AuthContext); // Access the token

    if (!showModal) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Customer Information</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name" name="name" value={customerInfo.name} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" name="email" value={customerInfo.email} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <textarea className="form-control" id="address" name="address" value={customerInfo.address} onChange={handleInputChange}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input type="text" className="form-control" id="city" name="city" value={customerInfo.city} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zipCode">ZIP Code</label>
                                <input type="text" className="form-control" id="zipCode" name="zipCode" value={customerInfo.zipCode} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <input type="text" className="form-control" id="country" name="country" value={customerInfo.country} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="paymentMethod">Payment Method</label>
                                <select className="form-control" id="paymentMethod" name="paymentMethod" value={customerInfo.paymentMethod} onChange={handleInputChange}>
                                    <option>Credit Card</option>
                                    <option>PayPal</option>
                                    <option>Bank Transfer</option>
                                </select>
                            </div>
                            {!token && (
                                <>
                                    <div className="form-check mt-3">
                                        <input type="checkbox" className="form-check-input" id="registerUser" name="registerUser" checked={customerInfo.registerUser} onChange={handleInputChange} />
                                        <label className="form-check-label" htmlFor="registerUser">Register an account with this order</label>
                                    </div>
                                    {customerInfo.registerUser && (
                                        <>
                                            <div className="form-group mt-3">
                                                <label htmlFor="password">Password</label>
                                                <input type="password" className="form-control" id="password" name="password" value={customerInfo.password} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="confirmPassword">Confirm Password</label>
                                                <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={customerInfo.confirmPassword} onChange={handleInputChange} />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleOrderSubmit}>Submit Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfoModal;
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { fetchWithToken } from '../services/fetchWithToken';
import { publicFetch } from '../services/PublicFetch';
import CartItemCard from '../components/Cart/CartItemCard';
import CustomerInfoModal from '../components/Checkout/CustomerInfoModal';

const CheckoutPage = () => {
    const { cartItems, removeFromCart, updateItemQuantity, totalAmount } = useCart();
    const { token, login } = useContext(AuthContext);

    const [showModal, setShowModal] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        paymentMethod: 'Credit Card',
        registerUser: false,
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) {
                try {
                    const userInfo = await fetchWithToken('/users/userinfo', 'GET');
                    setCustomerInfo(info => ({
                        ...info,
                        name: userInfo.name,
                        email: userInfo.user_email,
                        address: userInfo.address || '',
                        city: userInfo.city || '',
                        zipCode: userInfo.zipCode || '',
                        country: userInfo.country || ''
                    }));
                } catch (error) {
                    console.error('Failed to fetch user information:', error.message);
                }
            }
        };

        fetchUserInfo();
    }, [token]);

    const registerAndLogin = async () => {
        if (customerInfo.password !== customerInfo.confirmPassword) {
            alert("Passwords do not match!");
            return null;
        }
        try {
            const response = await publicFetch('/users/register', {
                method: 'POST',
                body: JSON.stringify({
                    email: customerInfo.email,
                    password: customerInfo.password
                })
            });
            const data = await response.json();
            const { token } = data;
            if (token) {
                login(token);  // Update the auth context with the new token
                return token;
            } else {
                alert('Registration failed: Token not received.');
                return null;
            }
        } catch (error) {
            alert('Registration failed: ' + error.message);
            return null;
        }
    };

    const handleOrderSubmit = async () => {
        const orderData = {
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.product_price,
            })),
            totalAmount,
            customerInfo,
        };
    
        try {
            let response;
    
            if (customerInfo.registerUser && !token) {
                // Handle registration for guest user
                const registeredToken = await registerAndLogin();  // Handles registration and return a token
                if (!registeredToken) return;  // handle cases where registration fails
    
                // User checkout
                response = await fetchWithToken('/orders/checkout/user', 'POST', JSON.stringify(orderData), registeredToken);
            } else if (token) {
                // For logged-in users
                response = await fetchWithToken('/orders/checkout/user', 'POST', JSON.stringify(orderData), token);
            } else {
                // For guest users
                response = await publicFetch('/checkout/guest', {
                    method: 'POST',
                    body: JSON.stringify(orderData),
                });
            }
    
            const data = await response.json();
            alert(data.message);
            setShowModal(false);
        } catch (error) {
            alert(`Order submission failed: ${error.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomerInfo({
            ...customerInfo,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <main className="container mt-4">
            <h1 className="text-center">Checkout</h1>
            <div className="row">
                <div className="col-md-8">
                    <h2 className="h2">Your Cart Items</h2>
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItemCard
                                key={item.product_id}
                                item={item}
                                onRemove={() => removeFromCart(item.product_id)}
                                onUpdateQuantity={updateItemQuantity}
                            />
                        ))
                    ) : (
                        <p>Your cart is empty</p>
                    )}
                </div>
                <div className="col-md-4">
                    <h2 className="h2">Order Summary</h2>
                    <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>
                    <div className="d-grid gap-2 d-block">
                        <button className="btn btn-success mb-2" onClick={() => setShowModal(true)}>Complete Order</button>
                        <Link to="/" className="btn btn-secondary mb-2">Continue Shopping</Link>
                    </div>
                </div>
            </div>

            <CustomerInfoModal
                showModal={showModal}
                handleClose={() => setShowModal(false)}
                customerInfo={customerInfo}
                handleInputChange={handleInputChange}
                handleOrderSubmit={handleOrderSubmit}
            />
        </main>
    );
};

export default CheckoutPage;
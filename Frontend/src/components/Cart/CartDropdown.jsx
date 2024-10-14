import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import { Link } from 'react-router-dom';
import CartItemCard from './CartItemCard';

const CartDropdown = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const items = await fetchWithToken('/cart/items', 'GET');
                setCartItems(items); // Fetch and set cart items
            } catch (error) {
                console.error('Failed to fetch cart items:', error.message);
            }
        };

        fetchCartItems();
    }, []);

    const removeItemFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId)); // Update local state
    };

    const updateItemQuantity = (productId, newQuantity) => {
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.product_id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    return (
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="cartDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="material-icons">shopping_cart</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cartDropdown" style={{ width: '300px' }}>
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <CartItemCard 
                            key={item.product_id} 
                            item={item} 
                            onRemove={removeItemFromCart} 
                            onUpdateQuantity={updateItemQuantity} // Pass update function to CartItemCard
                        />
                    ))
                ) : (
                    <li className="dropdown-item">Cart is empty</li> // Show empty message
                )}
                <li><hr className="dropdown-divider" /></li>
                <li>
                    <Link to="/checkout" className="dropdown-item">Go to Checkout</Link>
                </li>
            </ul>
        </li>
    );
};

export default CartDropdown;

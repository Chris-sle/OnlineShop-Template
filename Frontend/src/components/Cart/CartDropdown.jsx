import React, { useContext, useEffect, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import { Link } from 'react-router-dom';
import CartItemCard from './CartItemCard';
import { AuthContext } from '../../context/AuthContext';
import { setGuestCart, getGuestCart, clearGuestCart } from '../../Utilities/cartUtils';

const CartDropdown = () => {
    const [cartItems, setCartItems] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (token) {
                    const items = await fetchWithToken('/cart/items', 'GET');
                    setCartItems(items);
                } else {
                    const guestCart = getGuestCart();
                    setCartItems(guestCart);
                }
            } catch (error) {
                console.error('Failed to fetch cart items:', error.message);
            }
        };

        fetchCartItems();
    }, [token]);

    const removeItemFromCart = (productId) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.filter(item => item.product_id !== productId);
            if (!token) {
                setGuestCart(updatedItems);
            }
            return updatedItems;
        });
    };

    const updateItemQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product_id === productId ? { ...item, quantity: newQuantity } : item
            );
            if (!token) {
                setGuestCart(updatedItems);
            }
            return updatedItems;
        });
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
                            onUpdateQuantity={updateItemQuantity}
                        />
                    ))
                ) : (
                    <li className="dropdown-item">Cart is empty</li>
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
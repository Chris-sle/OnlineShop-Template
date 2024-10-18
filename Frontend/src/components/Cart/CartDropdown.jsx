import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartItemCard from './CartItemCard';
import { AuthContext } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const CartDropdown = () => {
    const { token } = useContext(AuthContext);
    const { cartItems, fetchCartItems } = useCart();

    useEffect(() => {
        if (token) {
            fetchCartItems(token); // Fetch cart items if the user is logged in
        } else {
            fetchCartItems()
            // Optionally handle guest cart fetch logic here if needed
        }
    }, [token, fetchCartItems]);

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

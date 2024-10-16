import React, { useContext } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import { AuthContext } from '../../context/AuthContext';
import { setGuestCart, getGuestCart } from '../../Utilities/cartUtils';

const CartItemCard = ({ item, onRemove, onUpdateQuantity }) => {
    const { token } = useContext(AuthContext);

    const handleRemove = async () => {
        if (token) {
            try {
                await fetchWithToken(`/cart/items/${item.product_id}`, 'DELETE');
                onRemove(item.product_id);
            } catch (error) {
                console.error('Failed to remove cart item:', error.message);
            }
        } else {
            const guestCart = getGuestCart();
            const updatedCart = guestCart.filter(cartItem => cartItem.product_id !== item.product_id);
            setGuestCart(updatedCart);
            onRemove(item.product_id);
        }
    };

    const handleIncrease = async () => {
        const newQuantity = item.quantity + 1;
        
        if (token) {
            try {
                await fetchWithToken(`/cart/items`, 'POST', { product_id: item.product_id, quantity: newQuantity });
                onUpdateQuantity(item.product_id, newQuantity);
            } catch (error) {
                console.error('Failed to update quantity:', error.message);
            }
        } else {
            const guestCart = getGuestCart();
            const updatedCart = guestCart.map(cartItem =>
                cartItem.product_id === item.product_id ? { ...cartItem, quantity: newQuantity } : cartItem
            );
            setGuestCart(updatedCart);
            onUpdateQuantity(item.product_id, newQuantity);
        }
    };

    const handleDecrease = async () => {
        if (item.quantity === 1) {
            handleRemove(); 
        } else {
            const newQuantity = item.quantity - 1;
            if (token) {
                try {
                    await fetchWithToken(`/cart/items`, 'POST', { product_id: item.product_id, quantity: newQuantity });
                    onUpdateQuantity(item.product_id, newQuantity);
                } catch (error) {
                    console.error('Failed to update quantity:', error.message);
                }
            } else {
                const guestCart = getGuestCart();
                const updatedCart = guestCart.map(cartItem =>
                    cartItem.product_id === item.product_id ? { ...cartItem, quantity: newQuantity } : cartItem
                );
                setGuestCart(updatedCart);
                onUpdateQuantity(item.product_id, newQuantity);
            }
        }
    };

    return (
        <div className="card mb-2 mx-2">
            <div className="card-body d-flex justify-content-between align-items-center">
                <img src={item.product_ImgUrl} alt={item.product_name} className="img-thumbnail" style={{ width: '50px', marginRight: '10px' }} />
                <div className="flex-grow-1">
                    <h6 className="card-title">{item.product_name}</h6>
                    <p className="card-text">Quantity: {item.quantity}</p>
                    <p className="card-text">Price: ${item.product_price}</p>
                </div>
                <div>
                    <button className="btn btn-secondary" onClick={handleDecrease}>-</button>
                    <button className="btn btn-secondary" onClick={handleIncrease}>+</button>
                    <button className="btn btn-danger" onClick={handleRemove}>Remove</button>
                </div>
            </div>
        </div>
    );
};

export default CartItemCard;

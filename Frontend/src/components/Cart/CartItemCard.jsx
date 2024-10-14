import React from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';

const CartItemCard = ({ item, onRemove, onUpdateQuantity }) => {
    const handleRemove = async () => {
        try {
            await fetchWithToken(`/cart/items/${item.product_id}`, 'DELETE');
            onRemove(item.product_id);
        } catch (error) {
            console.error('Failed to remove cart item:', error.message);
        }
    };

    const handleIncrease = async () => {
        // Increase quantity by 1
        try {
            const newQuantity = item.quantity + 1;
            await fetchWithToken(`/cart/items`, 'POST', { product_id: item.product_id, quantity: newQuantity });
            onUpdateQuantity(item.product_id, newQuantity); // Update the parent component with the new quantity
        } catch (error) {
            console.error('Failed to update quantity:', error.message);
        }
    };

    const handleDecrease = async () => {
        // Decrease quantity by 1, but not below 1
        if (item.quantity === 1) {
            handleRemove(); // Remove item if quantity is 1
        } else {
            try {
                const newQuantity = item.quantity - 1; // bug where quanity keeps increasing.
                await fetchWithToken(`/cart/items`, 'POST', { product_id: item.product_id, quantity: newQuantity });
                onUpdateQuantity(item.product_id, newQuantity); // Update the parent component with the new quantity
            } catch (error) {
                console.error('Failed to update quantity:', error.message);
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

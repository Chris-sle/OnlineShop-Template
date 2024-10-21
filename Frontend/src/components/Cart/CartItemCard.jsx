import React, { useContext } from 'react';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const CartItemCard = ({ item }) => {
    const { token } = useContext(AuthContext); // Assuming useAuth hook provides token
    const { removeFromCart, updateItemQuantity } = useCart();

    const handleRemove = () => {
        removeFromCart(item.product_id, token);  // Use context function to remove item
    };

    const handleIncrease = () => {
        const newQuantity = item.quantity + 1;
        updateItemQuantity(item.product_id, newQuantity, token);  // Use context function to update quantity
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            const newQuantity = item.quantity - 1;
            updateItemQuantity(item.product_id, newQuantity, token);  // Use context function to update quantity
        } else {
            handleRemove();  // Remove item if quantity reaches 0
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

import React, { useContext } from 'react';
import { useCart } from '../../context/CartContext';

const AddToCartButton = ({ productInfo }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({ ...productInfo, quantity: 1 }); // Or use a state for quantity if needed
    };

    return (
        <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
    );
};

export default AddToCartButton;
import React from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';

const AddToCartButton = ({ productId }) => {
    const addToCart = async () => {
        try {
            await fetchWithToken('/cart/items', 'POST', { product_id: productId, quantity: 1 });
            alert('Product added to cart!');
        } catch (error) {
            console.error('Failed to add to cart:', error.message);
            alert('Failed to add to cart. Please try again later.');
        }
    };

    return (
        <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
    );
};

export default AddToCartButton;

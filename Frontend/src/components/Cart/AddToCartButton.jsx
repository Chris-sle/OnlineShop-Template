import React, { useContext, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import { AuthContext } from '../../context/AuthContext';
import { getGuestCart, setGuestCart } from '../../Utilities/cartUtils';

const AddToCartButton = ({ productId, productInfo }) => {
    const { token } = useContext(AuthContext);
    const [quantity, setQuantity] = useState(null);

    const addToCart = async () => {
        const currentQuantity = quantity !== null ? quantity + 1 : 1;

        if (token) {
            // For logged-in users, send request to server
            await fetchWithToken('/cart/items', 'POST', { product_id: productId, quantity: currentQuantity });
        } else {
            // For guest users, update local storage
            const guestCart = getGuestCart();
            const existingItem = guestCart.find(item => item.product_id === productId);

            if (existingItem) {
                // Update the quantity if the item is already in the cart
                existingItem.quantity = currentQuantity;
            } else {
                // Add the full product info with quantity for new items
                guestCart.push({ ...productInfo, quantity: currentQuantity });
            }

            setGuestCart(guestCart);
        }

        setQuantity(currentQuantity);
    };

    return (
        <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
    );
};

export default AddToCartButton;

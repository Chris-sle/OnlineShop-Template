import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItemCard from '../components/Cart/CartItemCard';

const CheckoutPage = () => {
    const { cartItems, removeFromCart, updateItemQuantity, totalAmount } = useCart();

    const handleOrderSubmit = () => {

    }

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
                                onRemove={() => removeFromCart(item.product_id)} // Removing item using context
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
                        <button className="btn btn-success mb-2" onClick={handleOrderSubmit}>Complete Order</button>
                        <Link to="/" className="btn btn-secondary mb-2">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CheckoutPage;
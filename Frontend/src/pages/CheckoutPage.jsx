import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../services/fetchWithToken';
import { Link } from 'react-router-dom';
import CartItemCard from '../components/Cart/CartItemCard';


const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const items = await fetchWithToken('/cart/items', 'GET');
                setCartItems(items);
                // Calculate total amount
                const total = items.reduce((acc, item) => acc + item.product_price * item.quantity, 0);
                setTotalAmount(total);
            } catch (error) {
                setError('Failed to fetch cart items for checkout.');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const handleOrderSubmit = async () => {
        // Logic for submitting the order goes here, e.g., sending data to the backend
        try {
            // Prepare order data (you might want to gather more information)
            const orderData = {
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                })),
                total_amount: totalAmount,
                // Additional fields like address can also be added if necessary
            };

            const response = await fetchWithToken('/orders', 'POST', orderData); // Just an example route
            console.log(response.message); // You might want to show a confirmation message
        } catch (error) {
            console.error('Failed to submit order:', error.message);
            setError('Failed to place order. Please try again.');
        }
    };

    if (loading) return <p>Loading checkout information...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className='container mt-4'>
            <h1 className='text-center'>Checkout</h1>
            <div className="row">
                <div className="col-md-8">
                    <h2 className='h2'>Your Cart Items</h2>
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItemCard key={item.product_id} item={item} onRemove={() => {}} /> // Can handle remove logic if needed
                        ))
                    ) : (
                        <p>Your cart is empty</p>
                    )}
                </div>
                <div className="col-md-4">
                    <h2 className='h2'>Order Summary</h2>
                    <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>
                    <button className="btn btn-success" onClick={handleOrderSubmit}>Complete Order</button>
                    <Link to="/" className="btn btn-secondary mt-2">Continue Shopping</Link>
                </div>
            </div>
        </main>
    );
};

export default CheckoutPage;

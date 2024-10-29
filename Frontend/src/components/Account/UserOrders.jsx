import React, { useEffect, useState, useContext } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import { AuthContext } from '../../context/AuthContext';

const UserOrders = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;

            try {
                const ordersData = await fetchWithToken('/orders/user-orders', 'GET');
                setOrders(ordersData);
            } catch (error) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const cancelOrder = async (transactionId) => {
        try {
            await fetchWithToken(`/orders/user-orders/${transactionId}/cancel`, 'PUT');
            setOrders(orders.map(order =>
                order.transaction_id === transactionId ? { ...order, current_status: 'Cancelled' } : order
            ));
        } catch (error) {
            setError('Failed to cancel order');
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h2>Your Orders</h2>
            {orders.map(order => (
                <div key={order.transaction_id} className="card mb-4">
                    <div className="card-header">
                        <h5>Order ID: {order.transaction_id}</h5>
                        <p>Total Amount: ${parseFloat(order.total_amount).toFixed(2)}</p>
                        <p>Status: {order.current_status}</p>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Order Details</h5>
                        <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Shipping Address:</strong> {`${order.address}, ${order.city}, ${order.zipCode}, ${order.country}`}</p>
                        
                        <h5 className="card-title mt-3">Products in Order</h5>
                        <ul className="list-group list-group-flush">
                            {order.products.map((product, index) => (
                                <li key={index} className="list-group-item">
                                    {product.product_name} - Quantity: {product.quantity}
                                    <br />
                                    Price at Purchase: ${parseFloat(product.priceAtPurchase).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card-footer">
                        {order.current_status === 'Pending' && (
                            <button 
                                className="btn btn-warning" 
                                onClick={() => cancelOrder(order.transaction_id)}>
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserOrders;
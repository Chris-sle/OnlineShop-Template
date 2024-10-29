import React, { useEffect, useState, useContext } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import { AuthContext } from '../../context/AuthContext';

const SellerOrders = () => {
    const { token, userId } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersData = await fetchWithToken(`/seller/orders/${userId}`, 'GET');
                console.log(ordersData);
                setOrders(ordersData);
            } catch (error) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, userId]);

    const updateOrderStatus = async (transactionId, newStatus) => {
        try {
            await fetchWithToken(`/seller/orders/${transactionId}`, 'PUT', { newStatus });
            setOrders(orders.map(order =>
                order.transaction_id === transactionId ? { ...order, current_status: newStatus } : order
            ));
        } catch (error) {
            setError('Failed to update order status');
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h2>Manage Your Orders</h2>
            {orders.map(order => (
                <div key={order.transaction_id} className="card mb-4">
                    <div className="card-header">
                        <h5>Order ID: {order.transaction_id}</h5>
                        <p>Status: {order.current_status}</p>
                        <p>Total Amount: ${parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Customer Information</h5>
                        <p>Name: {order.customer_name}</p>
                        <p>Email: {order.customer_email}</p>
                        <p>Address: {order.address}, {order.city}, {order.zipCode}, {order.country}</p>
                        <h5 className="card-title mt-3">Products in Order</h5>
                        <ul className="list-group list-group-flush">
                            {order.products.map((product, index) => (
                                <li key={index} className="list-group-item">
                                    {product.product_name} - Quantity: {product.quantity}
                                    <br />
                                    Price: ${parseFloat(product.priceAtPurchase).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="card-footer">
                        <button 
                            className="btn btn-info me-2" 
                            onClick={() => updateOrderStatus(order.transaction_id, 'Completed')}>
                            Mark as Completed
                        </button>
                        <button 
                            className="btn btn-warning" 
                            onClick={() => updateOrderStatus(order.transaction_id, 'Cancelled')}>
                            Cancel
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SellerOrders;
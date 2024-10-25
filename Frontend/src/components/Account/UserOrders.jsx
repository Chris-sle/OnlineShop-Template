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
            if (!token) return; // Don't fetch if no token

            try {
                const ordersData = await fetchWithToken('/orders/user-orders', 'GET'); // Updated endpoint for user orders
                setOrders(ordersData);
            } catch (error) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h2>Your Orders</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Shipping Address</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price at Purchase</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.transaction_id}>
                            <td>{order.transaction_id}</td>
                            <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                            <td>{order.current_status}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>{`${order.address}, ${order.city}, ${order.zipCode}, ${order.country}`}</td>
                            <td>{order.product_name}</td>
                            <td>{order.quantity}</td>
                            <td>${parseFloat(order.priceAtPurchase).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserOrders;
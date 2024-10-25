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
                const sellerId = userId;
                const ordersData = await fetchWithToken(`/seller/orders/${sellerId}`, 'GET');
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
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Name</th>
                        <th>Customer Email</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.transaction_id}>
                            <td>{order.transaction_id}</td>
                            <td>{order.customer_name}</td>
                            <td>{order.customer_email}</td>
                            <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                            <td>{order.current_status}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>
                                <button 
                                    className="btn btn-info" 
                                    onClick={() => updateOrderStatus(order.transaction_id, 'Completed')}>
                                    Mark as Completed
                                </button>
                                <button 
                                    className="btn btn-warning" 
                                    onClick={() => updateOrderStatus(order.transaction_id, 'Cancelled')}>
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SellerOrders;

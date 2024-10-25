import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersData = await fetchWithToken('/admin/orders', 'GET');
                console.log(ordersData);
                setOrders(ordersData);
            } catch (error) {
                setError('Failed to fetch orders');
            }
        };

        fetchOrders();
    }, []);

    const deleteOrder = async (orderId) => {
        try {
            await fetchWithToken(`/admin/orders/${orderId}`, 'DELETE');
            setOrders(orders.filter(order => order.transaction_id !== orderId));
        } catch (error) {
            setError('Failed to delete order');
        }
    };

    return (
        <div className="container mt-4">
            {error && <p className="text-danger">{error}</p>}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer Email</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Seller Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.transaction_id}>
                            <td>{order.transaction_id}</td>
                            <td>{order.user_email}</td>
                            <td>{parseFloat(order.total_amount).toFixed(2)}</td>
                            <td>{order.current_status}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>{order.seller_email}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteOrder(order.transaction_id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;

import { useState, useEffect, useContext } from 'react';
import apiClient from '../utils/apiClient';
import AuthContext from '../context/AuthContext';
import '../styles/Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data } = await apiClient.get(`/api/orders?page=${page}&limit=5`);
                setOrders(data.orders);
                setPages(data.pages);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [user, page]);

    if (!user) {
        return <div className="orders-container">Please login to view orders.</div>;
    }

    return (
        <div className="orders-container">
            <h2>My Orders</h2>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : orders.length === 0 ? (
                <div className="no-orders">No orders found.</div>
            ) : (
                <>
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-item">
                                <div className="order-header">
                                    <span>Order ID: {order._id}</span>
                                    <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="order-body">
                                    <p>Total: ${order.totalPrice}</p>
                                    <p>Status: {order.isDelivered ? "Delivered" : "Processing"}</p>
                                    <div className="order-items-preview">
                                        {order.orderItems.map((item, idx) => (
                                            <span key={idx}>{item.name} (x{item.qty}) </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="btn-page"
                        >
                            Previous
                        </button>
                        <span className="page-info">Page {page} of {pages}</span>
                        <button
                            disabled={page === pages}
                            onClick={() => setPage(page + 1)}
                            className="btn-page"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Orders;

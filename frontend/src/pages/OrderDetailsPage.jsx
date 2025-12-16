import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import OrderService from '../services/orderService';

function OrderDetailsPage() {
    const { id } = useParams(); // 1. Get the ID from the URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        OrderService.getOrderById(id)
            .then(data => {
                setOrder(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Could not find this order.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!order) return null;

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/">← Back to List</Link>
            
            <h1>Order #{order.id}</h1>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h2>{order.companyName}</h2>
                <p><strong>Car:</strong> {order.carName} {order.carModel}</p>
                <p><strong>Status:</strong> {order.status}</p>
                {/* Add more fields here as your backend grows */}
            </div>
        </div>
    );
}

export default OrderDetailsPage;
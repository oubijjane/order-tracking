import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import OrderService from '../services/orderService';

function OrderDetailsPage() {
    const { id } = useParams(); // 1. Get the ID from the URL
    const navigate = useNavigate();
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

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this order? This cannot be undone.");
        
        if (confirmDelete) {
            try {
                await OrderService.deleteOrder(id);
                // Redirect to home page after successful delete
                navigate('/'); 
            } catch (err) {
                console.error("Failed to delete:", err);
                alert("Failed to delete the order.");
            }
        }
    };

    if (loading) return <p>Loading details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!order) return null;

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/">← Back to List</Link>

            <h1>Order #{order.id}</h1>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h2>{order.companyName}</h2>
                <p><strong>Car:</strong> {order.carModel.carBrand.brand} {order.carModel.model} {order.year}</p>
                <p><strong>Status:</strong> {order.status}</p>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Order #{order.id}</h1>
                
                {/* --- THE DELETE BUTTON --- */}
                <button 
                    onClick={handleDelete}
                    style={{ 
                        backgroundColor: '#dc3545', // Red color
                        color: 'white', 
                        padding: '10px 15px', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Delete Order
                </button>
            </div>
            </div>
        </div>
    );
}

export default OrderDetailsPage;
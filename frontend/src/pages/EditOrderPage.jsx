import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import OrderService from '../services/orderService';

function EditOrderPage() {
    const { id } = useParams(); // Get the ID from URL
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        companyName: '',
        carName: '',
        carModel: '',
        status: 'Pending'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 1. Load the existing data when page opens
    useEffect(() => {
        OrderService.getOrderById(id)
            .then(data => {
                setFormData(data); // Fill the form with existing data
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Could not find order to edit.");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 2. Send the UPDATED data back
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await OrderService.updateOrder(id, formData);
            navigate(`/orders/${id}`); // Go back to the Details page
        } catch (err) {
            console.error(err);
            setError("Failed to update order.");
        }
    };

    if (loading) return <p>Loading order data...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Edit Order #{id}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* Same inputs as Create Page */}
                <div>
                    <label>Company Name:</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required style={inputStyle} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Car Name:</label>
                        <input type="text" name="carName" value={formData.carName} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Car Model:</label>
                        <input type="text" name="carModel" value={formData.carModel} onChange={handleChange} style={inputStyle} />
                    </div>
                </div>


                <div>
                    <label>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Update Order
                    </button>
                    <button type="button" onClick={() => navigate(`/orders/${id}`)} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

const inputStyle = { width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' };

export default EditOrderPage;
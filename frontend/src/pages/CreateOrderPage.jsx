
import { useState } from 'react';
import { useNavigate } from 'react-router';
import OrderService from '../services/orderService';
import Form from '../components/form';

function CreateOrderPage1() {
    const navigate = useNavigate(); // This tool lets us redirect the user
    
    // 1. State for the form data
    const [formData, setFormData] = useState({
        companyName: '',
        carName: '',
        carModel: '',
        comment: 'test comment',
        destination: 'test destination',
        image: 'ar.jpg',
        registrationNumber: '1122-a-50',
        year: '2020',
        status: 'Pending' // Default value
    });

    const [error, setError] = useState("");

    // 2. Handle typing in inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 3. Handle the Submit button
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop the page from refreshing
        
        try {
            await OrderService.createOrder(formData);
            navigate('/'); // Redirect to Home on success
        } catch (err) {
            console.error(err);
            setError("Failed to create order. Check the backend console.");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Create New Order</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label>Company Name:</label>
                    <input 
                        type="text" 
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div>
                    <label>Car Name:</label>
                    <input 
                        type="text" 
                        name="carName" 
                        value={formData.carName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div>
                    <label>Car Model:</label>
                    <input 
                        type="text" 
                        name="carModel" 
                        value={formData.carModel}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div>
                    <label>Status:</label>
                    <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Save Order
                </button>
            </form>
        </div>
    );
}
function CreateOrderPage() {
    return (<Form />);
}
export default CreateOrderPage;
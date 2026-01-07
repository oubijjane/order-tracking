import Row from "../components/Row";
import brandService from '../services/brandService';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import "../styles/TableStyle.css";



function BrandsList() {
    const [brand, setBrand] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = () => {
         let apiCall;
        apiCall = brandService.getAllBrands();
        apiCall.then(data => {
            setBrand(data);
          })
          .catch(err => {
            console.error("Failed:", err);
            setError("Could not load users. Is the backend running?");
          });
        }
    return (
        <div className="admin-table-container"> {/* Added wrapper */}
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Liste des Marques</h2>
                
                {/* New Create Button */}
                <button 
                    className="create-btn" 
                    onClick={() => navigate('create-brand')} // Adjust path to match your App.js
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    + nouvelle marque
                </button>
            </div>
        <table className="user-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {brand.map(brand => (
                        <Row key={brand.id} name={brand.brand} id={brand.id} type={"brand"}/>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BrandsList;
import Row from "../components/Row";
import transitCompanyService from '../services/transitCompanyService';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import "../styles/TableStyle.css";



function TransitList() {
    const [transitCompany, setShowTransitCompany] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        fetchTransitCompany();
    }, []);

    const fetchTransitCompany = () => {
         let apiCall;
        apiCall = transitCompanyService.getTransitCompany();
        apiCall.then(data => {
            setShowTransitCompany(data);
          })
          .catch(err => {
            console.error("Failed:", err);
            setError("Could not load transit company. Is the backend running?");
          });
        }
    return (
        <div className="admin-table-container"> {/* Added wrapper */}
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Liste des transport</h2>
                
                {/* New Create Button */}
                <button 
                    className="create-btn" 
                    onClick={() => navigate('create-transit')} // Adjust path to match your App.js
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    + nouvelle Transport
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
                    {transitCompany.map(transit => (
                        <Row key={transit.id} name={transit.name} id={transit.id} type={"transport"}/>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransitList;
import CompanyRow from "../components/CompanyRow";
import companyService from '../services/companyService';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import "../styles/TableStyle.css";



function CompaniesList() {
    const [company, setCompany] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = () => {
         let apiCall;
        apiCall = companyService.getAllCompanies();
        apiCall.then(data => {
            setCompany(data);
          })
          .catch(err => {
            console.error("Failed:", err);
            setError("Could not load users. Is the backend running?");
          });
        }
    return (
        <div className="admin-table-container"> {/* Added wrapper */}
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Liste des companies</h2>
                
                {/* New Create Button */}
                <button 
                    className="create-btn" 
                    onClick={() => navigate('create-company')} // Adjust path to match your App.js
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    + nouvelle compagnie
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
                    {company.map(company => (
                        <CompanyRow key={company.id} {...company} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CompaniesList;
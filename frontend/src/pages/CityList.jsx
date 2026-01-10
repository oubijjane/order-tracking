import Row from "../components/Row";
import cityService from '../services/cityService';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import "../styles/TableStyle.css";

function CityList() {
    const [city, setCity] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        fetchCity();
    }, []);

    const fetchCity = () => {
         let apiCall;
        apiCall = cityService.getAllCities();
        apiCall.then(data => {
            setCity(data);
          })
          .catch(err => {
            console.error("Failed:", err);
            setError("Could not load city. Is the backend running?");
          });
        }
    return (
        <div className="admin-table-container"> {/* Added wrapper */}
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Liste des villes</h2>
                
                {/* New Create Button */}
                <button 
                    className="create-btn" 
                    onClick={() => navigate('create-city')} // Adjust path to match your App.js
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    + nouvelle ville
                </button>
            </div>
        <table className="user-table">
                <thead>
                    <tr>
                        <th>ville</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {city.map(city => (
                        <Row key={city.id} name={city.cityName} id={city.id} type={"city"}/>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CityList;
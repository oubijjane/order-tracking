import UserRow from "../components/UserRow";
import userService from '../services/userService';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import "../styles/TableStyle.css";



function UserList() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
         let apiCall;
        apiCall = userService.getAllusers();
        apiCall.then(data => {
            setUsers(data);
          })
          .catch(err => {
            console.error("Failed:", err);
            setError("Could not load users. Is the backend running?");
          });
        }
    return (
        <div className="admin-table-container"> {/* Added wrapper */}
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Liste des utilisateurs</h2>
                
                {/* New Create Button */}
                <button 
                    className="create-btn" 
                    onClick={() => navigate('create-user')} // Adjust path to match your App.js
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    + Nouveau Utilisateur
                </button>
            </div>
        <table className="user-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <UserRow key={user.id} {...user} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
        
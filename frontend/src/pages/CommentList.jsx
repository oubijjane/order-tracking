import Row from "../components/Row";
import commentService from '../services/commentService';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import "../styles/TableStyle.css";

function CommentsList() {
    const [comment, setComment] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = () => {
         let apiCall;
        apiCall = commentService.getAllComments();
        apiCall.then(data => {
            setComment(data);
          })
          .catch(err => {
            console.error("Failed:", err);
            setError("Could not load comments. Is the backend running?");
          });
        }
    return (
        <div className="admin-table-container"> {/* Added wrapper */}
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Liste des commentaires</h2>
                
                {/* New Create Button */}
                <button 
                    className="create-btn" 
                    onClick={() => navigate('create-comment')} // Adjust path to match your App.js
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    + nouvelle commentaire
                </button>
            </div>
        <table className="user-table">
                <thead>
                    <tr>
                        <th>Commentaire</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {comment.map(comment => (
                        <Row key={comment.id} name={comment.label} id={comment.id} type={"comment"} enablStatus={true} enabled={comment.active}/>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CommentsList;
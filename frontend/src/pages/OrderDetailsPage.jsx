import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import OrderService from '../services/orderService';
import { ORDER_STATUS_MAP, statusLabel } from '../utils/formUtils';
import ButtonStatus from '../components/ButtonStatus';
import Button from '../components/Button';
import '../styles/OrderDetails.css';

function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isUpdating, setIsUpdating] = useState(false);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const IMAGE_BASE_URL = "http://192.168.1.242:8080/uploads/";

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

    const handleSubmit = async (updatedStatus) => {
        setIsUpdating(true);
        try {
            await OrderService.handleDecision(id, updatedStatus);
            setOrder(prevOrder => ({
                ...prevOrder,
                status: updatedStatus
            }));
        } catch (err) {
            console.error("Failed to update order status:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this order? This cannot be undone.");
        if (confirmDelete) {
            try {
                await OrderService.deleteOrder(id);
                navigate('/'); 
            } catch (err) {
                console.error("Failed to delete:", err);
                alert("Failed to delete the order.");
            }
        }
    };

    if (loading) return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p>Chargement des détails...</p>
        </div>
    );

    if (error) return (
        <div className="details-container">
            <div className="alert-error">{error}</div>
            <Link to="/" className="back-link">← Retour au Dashboard</Link>
        </div>
    );

    if (!order) return null;

    return (
        <div className="details-container">
            {/* Navigation Header */}
            <nav className="details-nav">
                <Button 
                    text="← Retour" 
                    onClick={() =>navigate(-1)} 
                    className="btn-back-simple"
                />
            </nav>

            <div className="details-grid">
                
                {/* LEFT COLUMN: The Image */}
                <div className="details-visual">
                    <div className="image-card">
                        {order.image ? (
                            <img 
                                src={`${IMAGE_BASE_URL}${order.image}`} 
                                alt="Car Damage"
                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                            />
                        ) : (
                            <div className="no-image-placeholder">
                                <p>No Image Available</p>
                            </div>
                        )}
                        <div className="image-caption">Preuve Visuelle du Dommage</div>
                    </div>
                </div>

                {/* RIGHT COLUMN: The Data */}
                <div className="details-info">
                    <div className={`info-card border-${order.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="info-header">
                            <span className="order-id">ORDRE #{order.id}</span>
                            <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                {ORDER_STATUS_MAP[order.status]}
                            </span>
                        </div>

                        <h1 className="company-title">{order.company.companyName}</h1>

                        <div className="specs-grid">
                            <div className="spec-item">
                                <label>Véhicule</label>
                                <p>{order.carModel.carBrand.brand} {order.carModel.model} ({order.year})</p>
                            </div>
                            <div className="spec-item">
                                <label>Matricule</label>
                                <p className="plate-number">{order.registrationNumber}</p>
                            </div>
                            <div className="spec-item">
                                <label>Type de vitre</label>
                                <p>{order.windowType}</p>
                            </div>
                            <div className="spec-item">
                                <label>Destination / Ville</label>
                                <p>{order.city.cityName} — {order.destination}</p>
                            </div>
                        </div>

                        <div className="comment-section">
                            <label>Commentaire</label>
                            <p>{order.comment || "Aucun commentaire disponible."}</p>
                        </div>

                        {/* Actions Section */}
                        <div className="action-footer">
                            <ButtonStatus 
                                status={statusLabel(order.status)} 
                                handleClick={handleSubmit} 
                                disabled={isUpdating}
                            />
                            
                            <button 
                                className="btn-delete-simple"
                                onClick={handleDelete}
                            >
                                Delete Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsPage;
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import OrderService from '../services/orderService';
import { ORDER_STATUS_MAP, statusLabel } from '../utils/formUtils';
import ButtonStatus from '../components/ButtonStatus';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import '../styles/OrderDetails.css';

function OrderDetailsPage() {
    // 1. Destructure 'loading' from AuthContext to track auth state
    const { user, loading: authLoading } = useAuth(); 
    const { id } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const IMAGE_BASE_URL = "http://192.168.1.242:8080";

    // 2. Safe Role Extraction (only runs when user exists)
    const roles = user?.roles || [];


    useEffect(() => {
        // Only fetch order if we aren't waiting for auth to finish
        if (!authLoading) {
            OrderService.getOrderById(id)
                .then(data => {
                    setOrder(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError("Could not find this order.");
                    setLoading(false);
                });
        }
    }, [id, authLoading, user]); // Added user and authLoading to dependencies

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
        const confirmDelete = window.confirm("Are you sure you want to delete this order?");
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

    // 3. Show a specific loader while checking if user is logged in
    if (authLoading || loading) return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p>{authLoading ? "Checking permissions..." : "Chargement des détails..."}</p>
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
            <nav className="details-nav">
                <button onClick={() => navigate(-1)} className="btn-back-simple">
                    ← Retour
                </button>
            </nav>

            <div className="details-grid">
               <div className="details-visual">
    <div className="image-card">
        {order.images && order.images.length > 0 ? (
            <div className="image-gallery">
                {/* Main large image (shows the first one by default) */}
                <div className="main-image-container" onClick={() => setIsModalOpen(true)}>
                    <img 
                        src={`${IMAGE_BASE_URL}${order.images[selectedImgIndex].url}`} 
                        alt="Car Damage"
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                </div>
                
                {/* Thumbnails list if there is more than 1 image */}
                {order.images.length > 1 && (
                    <div className="thumbnail-grid">
                        {order.images.map((img, idx) => (
                            <img 
                                key={img.id || idx}
                                src={`${IMAGE_BASE_URL}${img.url}`} 
                                alt={`Thumbnail ${idx + 1}`}
                                className="thumbnail-item"
                                // Optional: add a click handler to change the main image
                                onClick={() => setSelectedImgIndex(idx)}
                            />
                        ))}
                    </div>
                )}
            </div>
        ) : (
            <div className="no-image-placeholder"><p>No Images Available</p></div>
        )}
        <div className="image-caption">
            {order.images?.length || 0} Photo(s) de Preuve Visuelle
        </div>
    </div>
</div>

                <div className="details-info">
                    <div className={`info-card border-${order.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="info-header">
                            <span className="order-id">ORDRE #{order.id}</span>
                            <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                {ORDER_STATUS_MAP[order.status] || order.status}
                            </span>
                        </div>

                        <h1 className="company-title">{order.company.companyName}</h1>

                        <div className="specs-grid">
                            <div className="spec-item"><label>Véhicule</label><p>{order.carModel.carBrand.brand} {order.carModel.model} ({order.year})</p></div>
                            <div className="spec-item"><label>Matricule</label><p className="plate-number">{order.registrationNumber}</p></div>
                            <div className="spec-item"><label>Type de vitre</label><p>{order.windowType}</p></div>
                            <div className="spec-item"><label>Destination</label><p>{order.city.cityName} — {order.destination}</p></div>
                        </div>

                        <div className="comment-section">
                            <label>Commentaire</label>
                            <p>{order.comment || "Aucun commentaire disponible."}</p>
                        </div>

                        <div className="action-footer">
                            {/* Pass roles to the status label logic */}
                            <ButtonStatus 
                                status={statusLabel(order.status, roles)} 
                                handleClick={handleSubmit} 
                                disabled={isUpdating}
                            />
                            
                            {/* 4. PROTECT THE DELETE BUTTON: Only Admins/Gestionnaires see this */}
                            {(roles.includes('ROLE_ADMIN') || roles.includes('ROLE_GESTIONNAIRE')) && (
                                <button 
                                    className="btn-delete-simple"
                                    onClick={handleDelete}
                                    disabled={isUpdating}
                                >
                                    Delete Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
        {/* Navigation Buttons */}
        <button 
            className="modal-nav-btn prev" 
            onClick={(e) => {
                e.stopPropagation();
                setSelectedImgIndex((prev) => (prev === 0 ? order.images.length - 1 : prev - 1));
            }}
        >
            &#10094;
        </button>

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</button>
            <img 
                src={`${IMAGE_BASE_URL}${order.images[selectedImgIndex].url}`} 
                alt="Full Size View" 
            />
            {/* Counter for UX */}
            <div className="modal-counter">
                {selectedImgIndex + 1} / {order.images.length}
            </div>
        </div>

        <button 
            className="modal-nav-btn next" 
            onClick={(e) => {
                e.stopPropagation();
                setSelectedImgIndex((prev) => (prev === order.images.length - 1 ? 0 : prev + 1));
            }}
        >
            &#10095;
        </button>
    </div>
)}
        </div>
    );  
}

export default OrderDetailsPage;
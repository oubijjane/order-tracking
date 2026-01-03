import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import OrderService from '../services/orderService';
import { ORDER_STATUS_MAP, statusLabel } from '../utils/formUtils';
import ButtonStatus from '../components/ButtonStatus';
import { CancellationModal } from '../components/CancellationModal';
import { ImageGallery } from '../components/ImageGallery';
import { useAuth } from '../context/AuthContext';
import '../styles/OrderDetails.css';

function OrderDetailsPage() {
    const { user, loading: authLoading } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    // UI States
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Data State
    const [order, setOrder] = useState(null);

    // Cancellation Modal States
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [pendingStatus, setPendingStatus] = useState(null);

    const roles = user?.roles || [];

    useEffect(() => {
        if (!authLoading) {
            OrderService.getOrderById(id)
                .then(data => {
                    setOrder(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError("Impossible de trouver cette commande.");
                    setLoading(false);
                });
        }
    }, [id, authLoading]);

    /**
     * logic 1: Intercept the status change
     */
    const handleStatusClick = (newStatus) => {
        if (newStatus === 'CANCELLED' || newStatus === 'NOT_AVAILABLE') {
            setPendingStatus(newStatus);

            setShowCancelModal(true);
        } else {
            handleSubmit(newStatus);
        }
    };

    
    const handleSubmit = async (updatedStatus, reasonId = null) => {
    setIsUpdating(true);
    try {
        // Pass the ID to the service
        await OrderService.handleDecision(id, updatedStatus, reasonId);
        console.log("reason id in the OrderDetailsPafe " + reasonId)
        setOrder(prevOrder => ({
            ...prevOrder,
            status: updatedStatus,
            // Note: Since we only sent the ID, the UI 'comment' 
            // will only update after a page refresh unless the backend 
            // returns the full object.
        }));
        const freshData = await OrderService.getOrderById(id);
        setOrder(freshData);

        setShowCancelModal(false);
    } catch (err) {
        console.error("Update failed:", err);
        alert("La mise à jour a échoué.");
    } finally {
        setIsUpdating(false);
    }
};

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
            try {
                await OrderService.deleteOrder(id);
                navigate('/');
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Erreur lors de la suppression.");
            }
        }
    };

    if (authLoading || loading) return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p>Chargement...</p>
        </div>
    );

    if (error || !order) return (
        <div className="details-container">
            <div className="alert-error">{error || "Commande introuvable"}</div>
            <Link to="/" className="back-link">← Retour au Dashboard</Link>
        </div>
    );

    return (
        <div className="details-container">
            <nav className="details-nav">
                <button onClick={() => navigate(-1)} className="btn-back-simple">← Retour</button>
            </nav>

            <div className="details-grid">
                {/* Visual Section */}
                <ImageGallery 
                    images={order.images} 
                    selectedImgIndex={selectedImgIndex} 
                    setSelectedImgIndex={setSelectedImgIndex}
                    IMAGE_BASE_URL="http://192.168.1.242:8080"
                />

                {/* Info Section */}
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
                            <ButtonStatus 
                                status={statusLabel(order.status, roles)} 
                                handleClick={handleStatusClick} 
                                disabled={isUpdating}
                            />
                            
                            {(roles.includes('ROLE_ADMIN') || roles.includes('ROLE_GESTIONNAIRE')) && (
                                <button className="btn-delete-simple" onClick={handleDelete} disabled={isUpdating}>
                                    Supprimer l'ordre
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancellation Reason Modal */}
            <CancellationModal isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onSubmit={(id) => handleSubmit(pendingStatus, id)}
                         isUpdating={isUpdating}
                reason={cancelReason}
                updateReason={setCancelReason}/>
        </div>
    );
}

export default OrderDetailsPage;
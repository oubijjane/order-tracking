import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import OrderService from '../services/orderService';
import { ORDER_STATUS_MAP, statusLabel, formatDate,WINDOW_TYPES } from '../utils/formUtils';
import ButtonStatus from '../components/ButtonStatus';
import { CancelationModal } from '../components/CancelationModal';
import {CommentModal} from '../components/CommentModal';
import {OfferSelectionModal} from '../components/OfferSelectionModal';
import { FileNumberModal } from '../components/FileNumberModal';
import { TransitModal } from '../components/TransitModal'; // Import the new modal
import { WindowDetailsModal } from '../components/WindowDetailsModal';
import { ImageGallery } from '../components/ImageGallery';
import  OrderHistory  from '../components/OrderHistory';
import { useAuth } from '../context/AuthContext';
import {useWindowDetailsSelection} from '../hooks/useWindowDetailsSelection';
import '../styles/OrderDetails.css';
import { set } from 'react-hook-form';


function OrderDetailsPage() {
    const { user, loading: authLoading } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    // UI States
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [commentId, setCommentId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const selectedOffer = useWindowDetailsSelection(id)[0]?.label;
    console.log("selected offer in the order details page " + selectedOffer);

    // Data State
    const [order, setOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]); // New State for Order History

    // Modal States
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [showTransitModal, setShowTransitModal] = useState(false);
    const [showFileNumberModal, setFileNumberModal] = useState(false);
    const [showWindowDetailsModal, setShowWindowDetailsModal] = useState(false);
    const [showWindowOfferModal, setShowWindowOfferModal] = useState(false);
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
            OrderService.getOrderHistory(id)
                .then(historyData => setOrderHistory(historyData))
                .catch(err => console.error("Erreur historique:", err));
        }
    }, [id, authLoading]);

    /**
     * logic 1: Intercept the status change
     */
    const handleStatusClick = (newStatus) => {
        if (newStatus === 'CANCELLED' || newStatus === 'NOT_AVAILABLE') {
            setPendingStatus(newStatus);
            setShowCancelModal(true);
        } else if (newStatus === 'IN_TRANSIT') {
            // Logic 2: Intercept IN_TRANSIT to open TransitModal
            setPendingStatus(newStatus);
            setShowTransitModal(true);
        } else if (newStatus === 'AVAILABLE') {
            // Logic: Intercept AVAILABLE to open WindowDetailsModal
            setPendingStatus(newStatus);
            setShowWindowDetailsModal(true);
        } else if (newStatus === 'SENT') {
            // Logic: Intercept AVAILABLE to open WindowDetailsModal
            setPendingStatus(newStatus);
            setShowWindowOfferModal(true);
        } else if (order.status === 'REPAIRED') {
            setFileNumberModal(true);
        }
        else {
            handleSubmit(newStatus);
        }
    };
    const handleFileNumberClick = () => {
        if (order.status === 'REPAIRED') {
            setFileNumberModal(true);
        }
    };

    /**
     * Logic 3: Update handleSubmit to accept transit parameters and window details
     */
    const handleSubmit = async (updatedStatus, reasonId = commentId, transitCompanyId = null, declarationNumber = null, fileNumber = null, windowsList = null, windowDetailId = null, cityId = null, phoneNumber = null) => {
        setIsUpdating(true);
        try {
            // The service call now takes all potential extra data
            await OrderService.handleDecision(id, updatedStatus, reasonId, transitCompanyId, declarationNumber, fileNumber, windowsList, windowDetailId, cityId, phoneNumber);
            // Refresh local state
            console.log("resonId after submit " + reasonId);
            const [freshOrder, freshHistory] = await Promise.all([
                OrderService.getOrderById(id),
                OrderService.getOrderHistory(id)
            ]);
            setOrder(freshOrder);
            setOrderHistory(freshHistory);


            // Close any open modals
            setShowCancelModal(false);
            setShowTransitModal(false);
            setShowWindowDetailsModal(false);
        } catch (err) {
            console.error("Update failed:", err);
            // Show the actual backend error message if available
            alert(err.response?.data?.message || "La mise à jour a échoué.");
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
                
                {/* LEFT COLUMN: Image + History */}
                <div className="left-column">
                    <div className="image-card">
                        <ImageGallery 
                            images={order.images} 
                            selectedImgIndex={selectedImgIndex} 
                            setSelectedImgIndex={setSelectedImgIndex}
                            IMAGE_BASE_URL="http://192.168.1.242:8080"
                        />
                    </div>
                    
                    <div className="history-wrapper">
                        <OrderHistory history={orderHistory} />
                    </div>
                </div>

                {/* RIGHT COLUMN: Info Card */}
                <div className="right-column">
                    <div className={`info-card border-${order.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="info-header">
                            <span className="order-id">ORDRE #{order.id}</span>
                            <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                {ORDER_STATUS_MAP[order.status] || order.status}
                            </span>
                        </div>

                        <h1 className="company-title">{order.company.companyName}</h1>

                        <div className="specs-grid">
                            <div className="spec-item"><label>Crée par: </label><p>{order.user.username}</p></div>
                            <div className="spec-item"><label>Véhicule</label><p>{order.carModel.carBrand.brand} {order.carModel.model}</p></div>
                            <div className="spec-item"><label>Date de creation</label><p>{formatDate(order.createdAt)}</p></div>
                            <div className="spec-item"><label>Dernier mise a jour</label><p>{formatDate(order.updatedAt)}</p></div>
                            <div className="spec-item"><label>Matricule</label><p className="plate-number">{order.registrationNumber}</p></div>
                            <div className="spec-item"><label>Type de vitre</label><p>{WINDOW_TYPES.find(type => type.value === order.windowType)?.label || order.windowType}</p></div>
                            <div className="spec-item"><label>Destination</label><p>{order.city ? order.city.cityName : 'Non renseigné'}</p></div>
                            
                            {order.transitCompany && (
                                <div className="spec-item"><label>Transporteur</label><p>{order.transitCompany.name}</p></div>
                            )}
                            {order.declarationNumber && (
                                <div className="spec-item"><label>N° Déclaration</label><p>{order.declarationNumber}</p></div>
                            )}
                            {order.phoneNumber && (
                                <div className="spec-item"><label>Numéro de téléphone</label><p>{order.phoneNumber}</p></div>
                            )}
                        </div>

                        {order.status === 'REPAIRED' && (
                            <div className="spec-item">
                                <label>Numéro de dossier</label>
                                <p className={!order.fileNumber ? "text-muted" : "plate-number"}>
                                    {order.fileNumber || "Non renseigné"}
                                </p>
                            </div>
                        )}
                        {checkStatus(order.status) && (
                            <div className="spec-item">
                                <label>Maque/ prix</label>
                                <p className="plate-number">
                                    { selectedOffer|| "Non renseigné"}
                                </p>
                            </div>
                        )}

                        <div className="comment-section">
                            <label>Commentaire actuel</label>
                            <p>{order.comment || "Aucun commentaire disponible."}</p>
                        </div>
                        <div className="action-footer">
                            <ButtonStatus 
                                status={statusLabel(order.status, roles)} 
                                handleClick={handleStatusClick} 
                                disabled={isUpdating}
                            />
                            
                            {order.status === 'REPAIRED' && (
                                <button className="btn-action-outline" onClick={handleFileNumberClick} disabled={isUpdating}>
                                    Modifier numéro de dossier
                                </button>
                            )}
                            
                                <button className="btn-action-outline" onClick={() => setIsCommentModalOpen(true)} disabled={isUpdating}>
                                    Ajouter un commentaire
                                </button>

                            {roles.includes('ROLE_ADMIN') && (
                                <button className="btn-delete-simple" onClick={handleDelete} disabled={isUpdating}>
                                    Supprimer l'ordre
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CancelationModal 
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onSubmit={(reasonId) => handleSubmit(pendingStatus, reasonId)}
                isUpdating={isUpdating}
            />
            <CommentModal 
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                onSubmit={(reasonId) => setCommentId(reasonId)}
                isUpdating={isUpdating}
            />
            <TransitModal 
                isOpen={showTransitModal}
                onClose={() => setShowTransitModal(false)}
                onSubmit={(companyId, decNumber) => handleSubmit(pendingStatus, null, companyId, decNumber)}
                isUpdating={isUpdating}
            />

            <WindowDetailsModal 
                isOpen={showWindowDetailsModal}
                onClose={() => setShowWindowDetailsModal(false)}
                onSubmit={(windowsList) => handleSubmit(pendingStatus, commentId, null, null, null, windowsList)}
                isUpdating={isUpdating}
            />

            <FileNumberModal
                isOpen={showFileNumberModal}
                onClose={() => setFileNumberModal(false)}
                onSubmit={(fileNumber) => handleSubmit(null, commentId, null, null, fileNumber)}
                isUpdating={isUpdating}
            />
             <OfferSelectionModal
                isOpen={showWindowOfferModal}
                onClose={() => setShowWindowOfferModal(false)}
                onSubmit={(windowDetailId, cityId,  phoneNumber) => handleSubmit(pendingStatus, commentId, null, null, null, null, windowDetailId, cityId, phoneNumber)}
                isUpdating={isUpdating}
            />
        </div>
        
    );
}

function checkStatus(status) {

    if(status === 'REPAIRED') {
        return true;
    } else if (status === 'SENT') {
        return true;
    } else if (status === 'RECEIVED') {
        return true;
    } else if (status === 'RETURN') {
        return true;
    } else if( status === 'IN_TRANSIT') {
        return true;
    } else {
        return false;
    }
}

export default OrderDetailsPage;
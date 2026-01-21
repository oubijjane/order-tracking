import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import OrderRow from "../components/OrderRow";
import {useDownload} from "../context/DownloadContext";
import orderService from "../services/orderService";
import { useCitySelection } from "../hooks/useCitySelection";
import { city_search } from "../validation/inputValidation";
import { Dropdown } from "../components/Input";
import {TransitModal} from "../components/TransitModal";
import "../styles/TableStyle.css";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showTransitModal, setShowTransitModal] = useState(false);
    
    // --- Selection State ---
    const [selectedIds, setSelectedIds] = useState([]);

    const pageSize = 9;
    const cityOptions = useCitySelection();

    const methods = useForm({
        defaultValues: { cityId: "" }
    });

    const selectedCityId = methods.watch("cityId");

    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        const cityLabel = cityOptions.find(opt => Number(opt.value) === Number(selectedCityId))?.label || "";

        try {
            const apiCall = await orderService.getFilteredOrders(
                null, "SENT", null, cityLabel, pageSize, currentPage
            );
            // Using .content based on your code snippet
            setOrders(apiCall.content || []);
            setTotalPages(apiCall.totalPages || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Impossible de charger les commandes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentPage, selectedCityId]);

    // Reset page and CLEAR selection when filter changes
    useEffect(() => {
        setCurrentPage(0);
        setSelectedIds([]);
    }, [selectedCityId]);

    // --- Selection Handlers ---
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(orders.map(order => order.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleTransitSubmit = async (companyId, decNumber) => {
    setLoading(true);
    try {
        await Promise.all(
            selectedIds.map(id => 
                orderService.handleDecision(id, 'IN_TRANSIT', null, companyId, decNumber)
            )
        );
        
        // Success actions
        await fetchOrders(); // Re-fetch data
        setSelectedIds([]);  // Reset checkboxes
        setShowTransitModal(false);
    } catch (err) {
        setError("Erreur lors de la mise en transit des commandes.");
    } finally {
        setLoading(false);
    }
};

    const getPageNumbers = () => {
        const maxVisible = 5;
        let start = Math.max(0, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible);
        if (end - start < maxVisible) start = Math.max(0, end - maxVisible);
        const pages = [];
        for (let i = start; i < end; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="order-list-page">
            <header className="orders-container">
                <h1>Suivi des Commandes Verauto</h1>
                <div className="header-line"></div>

                <FormProvider {...methods}>
                    <div className="filter-section" style={{ maxWidth: '300px', margin: '20px 0' }}>
                        <Dropdown 
                            {...city_search} 
                            name="cityId" 
                            options={cityOptions} 
                        />
                    </div>
                </FormProvider>
            </header>

            {/* Optional Selection Toolbar */}
            {selectedIds.length > 0 && (
                <div className="selection-toolbar" style={{ padding: '10px', background: '#e3f2fd', marginBottom: '10px', borderRadius: '4px' }}>
                    <strong>{selectedIds.length}</strong> commande(s) sélectionnée(s)
                </div>
            )}

            {loading ? (
                <div className="loading-spinner">Chargement...</div>
            ) : (
            
                <OrdersList 
                    orders={orders} 
                    error={error} 
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelectRow={handleSelectRow}
                    handelClick={() => setShowTransitModal(true)}
                    cityLabel={cityOptions.find(opt => Number(opt.value) === Number(selectedCityId))?.label || ""}
                />
            )}

            {!loading && totalPages > 1 && (
                <div className="pagination">
                    <button disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}>Précédent</button>
                    {getPageNumbers().map((index) => (
                        <button
                            key={index}
                            className={currentPage === index ? "active" : ""}
                            onClick={() => setCurrentPage(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)}>Suivant</button>
                </div>
            )}
            <TransitModal 
                isOpen={showTransitModal}
                onClose={() => setShowTransitModal(false)}
                onSubmit={(companyId, decNumber) =>handleTransitSubmit(companyId, decNumber)}
            />
        </div>
    );
}

function OrdersList({ orders, error, selectedIds, onSelectAll, onSelectRow, handelClick, cityLabel}) {
    if (error) return <div className="error-message">{error}</div>;
    if (orders.length === 0) return <div className="no-data">Aucune commande trouvée.</div>;

    const isAllSelected = orders.length > 0 && selectedIds.length === orders.length;
    const { isDownloading, downloadTransitOrders } = useDownload();

    return (
        <div className="table-container">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <IntransitButton onClick={() => handelClick()} />
            <button 
                className="download-button" 
                onClick={() => downloadTransitOrders(cityLabel)}
                disabled={isDownloading}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                    opacity: isDownloading ? 0.6 : 1
                }}
            >
                {isDownloading ? "Téléchargement..." : "Télécharger Excel"}
            </button>
        </div>
        <table className="user-table">
            <thead>
                <tr>
                    <th>
                        <input 
                            type="checkbox" 
                            checked={isAllSelected} 
                            onChange={onSelectAll} 
                        />
                    </th>
                    <th>Numéro de commande</th>
                    <th>Assurance</th>
                    <th>Ville</th>
                    <th>Véhicule</th>
                    <th>Statut</th>
                    <th>Date de creation</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <OrderRow 
                        key={order.id} 
                        order={order} 
                        isSelected={selectedIds.includes(order.id)}
                        onSelect={() => onSelectRow(order.id)}
                    />
                ))}
            </tbody>
        </table>
        </div>
    );
}

function IntransitButton({ onClick }) {
    return (
        <button className="intransit-button" onClick={onClick}>
            Mettre en transit
        </button>
    );
}
 function updatingOrders(ids= [], companyId, decNumber) {
    // Placeholder for future functionality
    ids.forEach(id => {
       orderService.handleDecision(id, 'IN_TRANSIT', null, companyId, decNumber);
    });
    return null;
}

export default Orders;
import StatusList from "../components/StatusList";
import { useState, useEffect } from "react";
import { ORDER_STATUS } from "../utils/formUtils";
import OrderService from "../services/orderService";
import "../styles/DashBoard.css"; // Ensure you create this file

function DashBoard() {
    const [ordersCount, setOrdersCount] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrdersCount();
    }, []);

    const fetchOrdersCount = () => {
        setIsLoading(true);
        OrderService.getOrderCountByStatus()
            .then(data => {
                setOrdersCount(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed:", err);
                setError("Could not load stats. Please check your connection.");
            });
    };
    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>Tableau de Bord</h1>
                <div className="header-line"></div>
            </header>
            {isLoading ? (
                <div className="loader">Chargement des statistiques...</div>
            ) :(
            <section className="stats-section">
                <StatusList statusData={ORDER_STATUS} counts={ordersCount}/>
            </section>
            )}
        </div>
    );
}

export default DashBoard;
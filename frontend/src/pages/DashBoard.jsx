import StatusList from "../components/StatusList";
import { ORDER_STATUS } from "../utils/formUtils";
import "../styles/DashBoard.css"; // Ensure you create this file

function DashBoard() {
    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>Tableau de Bord</h1>
                <div className="header-line"></div>
            </header>
            
            <section className="stats-section">
                <StatusList statusData={ORDER_STATUS} />
            </section>
        </div>
    );
}

export default DashBoard;
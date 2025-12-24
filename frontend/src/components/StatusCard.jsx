import { Link } from "react-router";
import {ORDER_STATUS_MAP} from '../utils/formUtils';

function StatusCard({   status, count }) {
  // Create a CSS-friendly class name (e.g., "En attente" -> "en-attente")
  const statusClass = ORDER_STATUS_MAP[status].toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`stat-card ${statusClass}`}>
      <Link to={`/status/${status}`} style={{ textDecoration: 'none', color: '#333' }}>
            <h2>{ORDER_STATUS_MAP[status]}</h2>
      </Link>
      <p className="stat-number">{count}</p>
      <span className="stat-label">Demandes</span>
    </div>
  );
}

export default StatusCard;
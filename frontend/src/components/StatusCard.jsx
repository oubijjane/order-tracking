function StatusCard({ status }) {
  // Create a CSS-friendly class name (e.g., "En attente" -> "en-attente")
  const statusClass = status.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`stat-card ${statusClass}`}>
      <h2>{status}</h2>
      <p className="stat-number">0</p>
      <span className="stat-label">Demandes</span>
    </div>
  );
}

export default StatusCard;
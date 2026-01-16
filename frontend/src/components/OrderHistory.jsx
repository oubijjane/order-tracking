
import { formatDate } from '../utils/formUtils';

function OrderHistory({ history }) {
    return (
        <div className="history-section">
            <h3 className="history-title">Historique des modifications</h3>
            <div className="history-scroll-box">
                {(!history || history.length === 0) ? (
                    <div className="empty-history">
                        <p className="text-muted">Aucun historique disponible pour cette commande.</p>
                    </div>
                ) : (
                    <div className="history-timeline">
                        {history.map((h, index) => (
                            <div key={index} className="history-item">
                                <div className="history-marker"></div>
                                <div className="history-card">
                                    <div className="history-meta">
                                        <span className="history-user">
                                            <i className="user-icon">👤</i> {h.changedBy}
                                        </span>
                                        <span className="history-date"> {formatDate(h.createAt)}</span>
                                    </div>
                                    <p className="history-content">
                                        <span className="action-tag">{h.action}:</span>
                                        <span className="new-value">{h.newValue}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
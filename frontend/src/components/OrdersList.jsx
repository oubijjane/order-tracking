import Order from './Order.jsx';
import '../styles/Orders.css';
import { useNavigate } from 'react-router';
import Button from './Button';

function OrdersList({ orders, error }) {
  const navigate = useNavigate();
  return (
    <div className="orders-container">
      {/* Header Section */}
      <header className="orders-header">
        <h1>Suivi des Commandes Verauto</h1>
        <div className="header-line"></div>
      </header>
      
      {/* Error Message */}
      {error && <div className="alert-error">{error}</div>}

      {/* Loading / Empty State */}
      {!error && orders.length === 0 && (
        <div className="empty-state">
          <p>Aucune commande trouvée pour le moment...</p>
        </div>
      )}

      {/* The Grid of Orders */}
       <Button 
                    text="← Retour" 
                    onClick={() =>navigate(-1)} 
                    className="btn-back-simple"
                />
      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className="order-card-wrapper">
             <Order order={order}/>
          </div>
        ))}
      </div>
    </div>
  );
}
export default OrdersList;
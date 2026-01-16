import { useParams, useNavigate, Link } from 'react-router';
import {ORDER_STATUS_MAP} from '../utils/formUtils';
import {formatDate} from '../utils/formUtils';

function Order({ order }) {
  return (
    <div className={`info-card border-${order.status?.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3><Link to={`/orders/${order.id}`} style={{ textDecoration: 'none', color: '#333' }}>
            {order.company.companyName}
          </Link>
      </h3>
      <p><strong>Details:</strong> {order.windowType} {order.carModel.carBrand.brand} {order.carModel.model}</p>
      <p><strong>Date de creation:</strong> {formatDate(order.createdAt)}</p>
      <p><strong>Matricule n°:</strong> <span className='plate-number'>{order.registrationNumber}</span></p>
      <p><strong>Ville:</strong> {order.city.cityName}</p>
      <p><strong>Status:</strong> {ORDER_STATUS_MAP[order.status]}</p>
      {order.status === 'REPAIRED' && (
        <p className='order-id'><strong>Numer de dossier:</strong> {order.fileNumber ? order.fileNumber : 'Non renseigné'}</p>)}
    </div>
  );
}

export default Order;
import { Link } from 'react-router';
import { ORDER_STATUS_MAP } from '../utils/formUtils';
import { WINDOW_TYPES, formatDate } from '../utils/formUtils';
import "../styles/TableStyle.css";


function OrderRow({ order, isSelected, onSelect}) {
    
    const windowLabel = WINDOW_TYPES.find(type => type.value === order.windowType)?.label 
                        || order.windowType
        
    
    return (
        <tr key={order.id}>
            <td>
                <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={onSelect} 
                />
            </td>
            <td>{order.id}</td>
            <td>{order.company.companyName}</td>
            <td>{order.city ? order.city.cityName : 'Non renseigné'}</td>
            <td>{windowLabel} {order.carModel.carBrand.brand} {order.carModel.model}</td>
            <td>{ORDER_STATUS_MAP[order.status] || order.status}</td>
            <td>{formatDate(order.createdAt)}</td>
            <td>
                <Link to={`/orders/${order.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                    Voir Détails
                </Link>
            </td>
        </tr>
    );
}
export default OrderRow;


import { useParams, useNavigate, Link } from 'react-router';

function Order({ order }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }} >
      <h3><Link to={`/orders/${order.id}`} style={{ textDecoration: 'none', color: '#333' }}>
            {order.companyName}
          </Link>
      </h3>
      <p><strong>Details:</strong> {order.carName} {order.carModel}</p>
      <p><strong>Status:</strong> {order.status}</p>
    </div>
  );
}

export default Order;
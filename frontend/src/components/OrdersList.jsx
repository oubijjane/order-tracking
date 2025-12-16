import Order from './Order.jsx';
function OrdersList({ orders, error }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Verauto Order Tracking</h1>
      
      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Loading State */}
      {!error && orders.length === 0 && <p>No orders found yet...</p>}

      {/* The List */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {orders.map(order => (
          <Order key={order.id} order={order}/>
        ))}
      </div>
    </div>
  );
}
export default OrdersList;
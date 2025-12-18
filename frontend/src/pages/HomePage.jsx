import { useState, useEffect } from 'react';
import OrderService from '../services/orderService'; 
import OrdersList from '../components/OrdersList';

function HomePage() {
  const [orders, setOrders] = useState([]); 
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    OrderService.getAllOrders()
      .then(data => {
        setOrders(data);
      })
      .catch(err => {
        console.error("Failed:", err);
        setError("Could not load orders. Is the backend running?");
      });
  };

  return (
    <OrdersList orders={orders} error={error} />
  )
  
}

export default HomePage;
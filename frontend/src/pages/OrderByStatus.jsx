import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import OrderService from '../services/orderService'; 
import OrdersList from '../components/OrdersList';
import api from '../services/api';

function OrdersByStatus() {
  const [orders, setOrders] = useState([]); 
  const [error, setError] = useState("");
  const { status } = useParams();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
   
    OrderService.getOrderByStatus(status).then(data => {
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

export default OrdersByStatus;
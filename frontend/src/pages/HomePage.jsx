import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import OrderService from '../services/orderService'; 
import OrdersList from '../components/OrdersList';
import api from '../services/api';

function HomePage() {
  const [orders, setOrders] = useState([]); 
  const [error, setError] = useState("");
  const { status } = useParams();

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const fetchOrders = () => {
    let apiCall;
    if (status) {
      // If a status exists in the URL, call the filtered endpoint
      apiCall = OrderService.getOrderByStatus(status);
      console.log("Fetching orders with status:", apiCall);
    } else {
      // Otherwise, call the endpoint to get all orders 
      apiCall = OrderService.getAllOrders();
    }
    apiCall.then(data => {
        setOrders(data);
      })
      .catch(err => {
        console.error("Failed:", err);
        setError("Could not load orders. Is the backend running?");
      });
  };

  return (
    <div>
    <header className="orders-container">
        <h1>Suivi des Commandes Verauto</h1>
        <div className="header-line"></div>
      </header>
    <OrdersList orders={orders} error={error} />
    </div>
  )
  
}

export default HomePage;
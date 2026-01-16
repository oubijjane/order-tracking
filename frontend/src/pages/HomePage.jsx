import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import OrderService from '../services/orderService'; 
import OrdersList from '../components/OrdersList';
import api from '../services/api';

function HomePage() {
  const [orders, setOrders] = useState([]); 
  const [error, setError] = useState("");
  const { status } = useParams(); // Captured from URL if you use /orders/:status
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // 1. Fetch data whenever status OR currentPage changes
  useEffect(() => {
    fetchOrders();
    // Scroll to top when page changes for better UX
    window.scrollTo(0, 0);
  }, [status, currentPage]);

  const fetchOrders = () => {
    // Note: status from useParams is used here if available
    OrderService.getFilteredOrders(
      null,    // company
      status || null, // status from URL
      null,    // reg
      null,    // city
      9,      // pageSize
      currentPage
    )
    .then(data => {
      setOrders(data.content);
      setTotalPages(data.totalPages);
    })
    .catch(err => setError("Could not load orders."));
  };

  // 2. Helper to determine which page numbers to show
  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible);

    // Adjust if we are near the end
    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    const pages = [];
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div>
      <header className="orders-container">
        <h1>Suivi des Commandes Verauto</h1>
        <div className="header-line"></div>
      </header>

      <OrdersList orders={orders} error={error} />

      {/* 3. Pagination UI */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* First Page */}
          {currentPage > 2 && (
             <button onClick={() => setCurrentPage(0)}>1</button>
          )}
          
          {currentPage > 3 && <span>...</span>}

          <button 
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Précédent
          </button>

          {getPageNumbers().map((index) => (
            <button
              key={index}
              className={currentPage === index ? "active" : ""}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </button>
          ))}

          <button 
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Suivant
          </button>

          {currentPage < totalPages - 4 && <span>...</span>}

          {currentPage < totalPages - 3 && (
             <button onClick={() => setCurrentPage(totalPages - 1)}>{totalPages}</button>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
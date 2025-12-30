import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import OrderService from '../services/orderService'; 
import OrdersList from '../components/OrdersList';
import api from '../services/api';

function OrdersByStatus() {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const { status } = useParams();

  // Reset to page 0 when the status (category) changes
  useEffect(() => {
    setCurrentPage(0);
  }, [status]);

  useEffect(() => {
    fetchOrders();
  }, [status, currentPage]);

  const fetchOrders = () => {
    setLoading(true);
    OrderService.getOrderByStatus(status, 9, currentPage)
      .then(data => {
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 0);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setError("Error loading data.");
      });
  };

  /**
   * SLIDING WINDOW LOGIC
   * This function returns an array of page numbers to show.
   * If totalPages is 100 and currentPage is 50, it shows [48, 49, 50, 51, 52]
   */
  const getPageNumbers = () => {
    const maxButtons = 5; // Adjust this to show more or fewer numbers
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons);

    // If we're near the end, adjust the start so we still show 'maxButtons'
    if (end - start < maxButtons) {
      start = Math.max(0, end - maxButtons);
    }

    const pages = [];
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
      <OrdersList orders={orders} error={error} loading={loading} />

      {totalPages > 1 && (
        <div className="pagination">
          {/* First Page Button */}
          {currentPage > 2 && (
             <button onClick={() => setCurrentPage(0)}>1</button>
          )}
          
          {/* Ellipsis if far from start */}
          {currentPage > 3 && <span>...</span>}

          <button 
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Précédent
          </button>

          {/* Render ONLY the window of page numbers */}
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

          {/* Ellipsis if far from end */}
          {currentPage < totalPages - 4 && <span>...</span>}

          {/* Last Page Button */}
          {currentPage < totalPages - 3 && (
             <button onClick={() => setCurrentPage(totalPages - 1)}>{totalPages}</button>
          )}
        </div>
      )}
    </>
  );
}
export default OrdersByStatus;
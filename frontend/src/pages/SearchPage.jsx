import { useState, useEffect } from 'react';
import OrderService from '../services/orderService'; 
import OrdersList from '../components/OrdersList';
import SearchForm from '../components/SearchForm';
import '../styles/SearchPage.css';



function SearchPage() {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState("");
  

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
  // 1. New state to hold current search criteria
  const [filters, setFilters] = useState({
    company: '',
    status: '',
    reg: '',
    city: ''
  });

  // 2. Fetch when filters OR page change
  useEffect(() => {
    fetchOrders();
  }, [filters, currentPage]);

  const fetchOrders = () => {
    OrderService.getFilteredOrders(
      filters.company, 
      filters.status, 
      filters.reg, 
      filters.city, 
      10, 
      currentPage
    )
    .then(data => {
      setOrders(data.content);
      setTotalPages(data.totalPages);
    })
    .catch(err => setError("Could not load orders."));
  };

  // 3. Callback function for the form
  const handleSearch = (searchData) => {
    setFilters(searchData);
    setCurrentPage(0); // Reset to first page on new search
  };

  return (
    <div className="search-container">
      
      {/* Include the form here and pass the callback */}
      <SearchForm onSearch={handleSearch} />


      <OrdersList orders={orders} error={error} />

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
    </div>
  );
}

export default SearchPage;
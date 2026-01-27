import ModelRow from "../components/ModelsRow";
import modelService from '../services/modelService';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import "../styles/TableStyle.css";



function ModelsList() {
  const [models, setModels] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch data whenever currentPage changes
  useEffect(() => {
    fetchModels();
  }, [currentPage]);
  
const fetchModels = () => {
  setLoading(true);
  modelService.getAllModels(currentPage, 10) 
    .then(data => {
      // If models are in data.content, this part is correct
      setModels(data.content || []); 
      
      // Target the nested 'page' object for pagination metadata
      if (data.page) {
        setTotalPages(data.page.totalPages);
        // It's also safer to sync the currentPage from the server's perspective
        setCurrentPage(data.page.number); 
      }
      
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed:", err);
      setError("Impossible de charger les modèles.");
      setLoading(false);
    });
};

  /**
   * SLIDING WINDOW LOGIC
   */
  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons);

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
    <div className="admin-table-container">
      <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Liste des modèles</h2>
         {/* New Create Button */}
                <button 
                    className="create-btn" 
                    onClick={() => navigate('create-model')} // Adjust path to match your App.js
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
          + Nouveau modèle
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>Modèle</th>
                <th>Marque</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {models.map(model => (
                <ModelRow key={model.id} modelName={model.model} carBrand={model.carBrand} id={model.id}/>
              ))}
            </tbody>
          </table>

          {/* PAGINATION UI */}
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
        </>
      )}
    </div>
  );
}

export default ModelsList;
import { useState } from 'react';
import { useDownload } from '../context/DownloadContext';
import SearchForm from '../components/SearchForm';

function ReportPage() {
  const [filters, setFilters] = useState({});
  const { isDownloading, downloadReport } = useDownload();

  const handleSearch = (searchData) => {
    setFilters(searchData);
  };

  return (
    <div className="report-container">
      <h2>Reporting</h2>
      <SearchForm onSearch={handleSearch} buttonName1='Appliquer'/>
      
      <div className="actions" style={{ marginTop: '20px' }}>
        <button 
          onClick={() => downloadReport(filters)} 
          disabled={isDownloading}
          className="btn-download"
        >
          {isDownloading ? "Préparation du fichier..." : "Exporter vers Excel"}
        </button>
        
        {isDownloading && (
          <p className="hint">
            ⏳ Le téléchargement continue même si vous quittez cette page.
          </p>
        )}
      </div>
    </div>
  );
}

export default ReportPage;
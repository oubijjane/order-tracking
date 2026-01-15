import React, { createContext, useContext, useState } from 'react';
import api from '../services/api'; // Your axios instance

const DownloadContext = createContext();

export const DownloadProvider = ({ children }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadReport = async (filters) => {
        setIsDownloading(true);
        try {
            // 1. Call the SXSSFWorkbook endpoint
            const response = await api.get('/orders/export', {
                params: {
                    company: filters.company || '',
                    status: filters.status || '',
                    reg: filters.reg || '',
                    city: filters.city || ''
                },
                responseType: 'blob' // Essential for binary files
            });

            // 2. Create the download link in memory
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Rapport_${new Date().toISOString().split('T')[0]}.xlsx`);
            
            // 3. Trigger download
            document.body.appendChild(link);
            link.click();
            
            // 4. Cleanup memory
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export Error:", error);
            alert("Une erreur est survenue lors du téléchargement.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <DownloadContext.Provider value={{ isDownloading, downloadReport }}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownload = () => useContext(DownloadContext);
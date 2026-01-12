import transtiCompanyService from '../services/transitCompanyService';
import { useState, useEffect } from 'react';

export const useTransitCompanySelection = () => {
    const [company, setCompany] = useState([]);
    // 1. Fetch Cities on Mount
    useEffect(() => {
        transtiCompanyService.getTransitCompany()
            .then(data => setCompany(data) )
            .catch(err => console.error("Failed to load transit company:", err));
    }, []); 
    // 2. Format options for the Dropdown component
    const transitCompanyOptions = company.map(c => ({ value: c.id, label: c.name }));
    return transitCompanyOptions;
}
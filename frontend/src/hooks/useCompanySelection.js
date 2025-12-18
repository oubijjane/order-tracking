import { useState, useEffect } from 'react';
import companyService from '../services/companyService';


export const useCompanySelection = () => {
    const [companies, setCompanies] = useState([]);
    // 1. Fetch Companies on Mount
    useEffect(() => {
        companyService.getAllCompanies()
            .then(data => setCompanies(data))
            .catch(err => console.error("Failed to load companies:", err));
    }, []); 
    // 2. Format options for the Dropdown component
    const companyOptions = companies.map(c => ({ value: c.id, label: c.companyName }));
    return companyOptions;
}
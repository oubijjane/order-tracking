import { useState, useEffect, useMemo } from 'react';
import companyService from '../services/companyService';

export const useCompanySelection = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        companyService.getAllCompanies()
            .then(data => setCompanies(data))
            .catch(err => console.error("Failed to load companies:", err));
    }, []); 

    // FIX: useMemo ensures companyOptions only changes when companies changes
    const companyOptions = useMemo(() => {
        return companies.map(c => ({ 
            value: c.id, 
            label: c.companyName 
        }));
    }, [companies]); 

    return companyOptions;
}
import { useState, useEffect } from 'react';
import windowDetailsService from '../services/windowDetailsService';

export const useWindowDetailsSelection = (id) => {
    const [windowDetails, setWindowDetails] = useState([]);
    // 1. Fetch Window Details on Mount
    useEffect(() => {
        windowDetailsService.getOrderWindowDetails(id)
            .then(data => setWindowDetails(data))
            .catch(err => console.error("Failed to load window details:", err));
    }, []); 
    // 2. Format options for the Dropdown component
    const windowDetailsOptions = windowDetails.map(w => ({ value: w.id, label: w.windowBrand + " - " + w.price }));
    return windowDetailsOptions;
}
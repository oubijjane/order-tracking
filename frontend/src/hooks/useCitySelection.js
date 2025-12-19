import { useState, useEffect } from 'react';
import cityService from '../services/cityService';

export const useCitySelection = () => {
    const [cities, setCities] = useState([]);
    // 1. Fetch Cities on Mount
    useEffect(() => {
        cityService.getAllCities()
            .then(data => setCities(data))
            .catch(err => console.error("Failed to load cities:", err));
    }, []); 
    // 2. Format options for the Dropdown component
    const cityOptions = cities.map(c => ({ value: c.id, label: c.cityName }));
    return cityOptions;
}

import { useState, useEffect } from 'react';
import windowBandService from '../services/windowBandService';

export const useWindowBrandSelection = () => {
    const [brands, setBrands] = useState([]);
    

    // 1. Fetch Brands on Mount
    useEffect(() => {
        windowBandService.getWindowBands()
            .then(data => setBrands(data))
            .catch(err => console.error("Failed to load brands:", err));
    }, []);

    // 2. Fetch Models when Brand changes
    

    // 3. Format options for the Dropdown component
    // (Doing this here keeps the main component clean)
    const brandOptions = brands.map(b => ({ value: b.id, label: b.windowBrand }));

    return brandOptions ;
};
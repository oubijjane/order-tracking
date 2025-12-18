import { useState, useEffect } from 'react';
import brandService from "../services/brandService";
import modelService from "../services/modelService";

export const useCarSelection = (selectedBrandId) => {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    // 1. Fetch Brands on Mount
    useEffect(() => {
        brandService.getAllBrands()
            .then(data => setBrands(data))
            .catch(err => console.error("Failed to load brands:", err));
    }, []);

    // 2. Fetch Models when Brand changes
    useEffect(() => {
        if (!selectedBrandId) {
            setModels([]);
            return;
        }

        modelService.getModelByBrand(selectedBrandId)
            .then(data => setModels(data))
            .catch(err => console.error("Failed to load models:", err));
    }, [selectedBrandId]);

    // 3. Format options for the Dropdown component
    // (Doing this here keeps the main component clean)
    const brandOptions = brands.map(b => ({ value: b.id, label: b.brand }));
    const modelOptions = models.map(m => ({ value: m.id, label: m.model }));

    return { brandOptions, modelOptions };
};
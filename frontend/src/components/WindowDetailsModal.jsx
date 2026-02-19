import { useState, useEffect, use } from 'react';
import { useParams } from 'react-router';
import { useForm, FormProvider } from "react-hook-form";
import { Dropdown, InputField, SearchableDropdown } from "./Input";
import { useCarSelection } from '../hooks/useCarSelection';
import { useWindowBrandSelection } from '../hooks/useWindowBrandSelection'; // Ensure correct hook name
import { window_price_input, window_brand_selection, brand_validation, car_model_validation} from '../validation/inputValidation'; // Assuming you have these
import "../styles/Modal.css"; // Assuming you have some basic styles

export function WindowDetailsModal({ isOpen, onClose, onSubmit, isUpdating, carModel, windowType }) {
    const [windows, setWindows] = useState([]);
    const [error, setError] = useState('');
    const { id } = useParams();

    // Initialize React Hook Form
    const methods = useForm({
        defaultValues: {
            windowBrandId: '',
            price: '',
            brandId: carModel?.carBrand.id ,
            carModelId: carModel?.id ,//this was modelId but the input needed carModelId
            windowType: windowType 
        }
    });
    const windowBrandOptions = useWindowBrandSelection();

    const selectedBrand = methods.watch('brandId');

    const { brandOptions, modelOptions } = useCarSelection(selectedBrand);

    useEffect(() => {
  if (!isOpen || !carModel) return;

  methods.reset({
    windowBrandId: '',
    price: '',
    brandId: carModel.carBrand.id,
    carModelId: carModel.id,
    windowType: windowType || ''
  });
}, [isOpen, carModel, windowType]);
    
    

    if (!isOpen) return null;

    // Logic to add a window to the temporary list
    const handleAddWindow = (e) => {
        e.preventDefault();
        const rawBrandId = methods.getValues("windowBrandId"); // This comes as a String
        const price = methods.getValues("price");

        // 1. Convert to Number to match your options array
        const brandId = Number(rawBrandId);

        if (!rawBrandId) {
            setError('La marque de vitre est requise.');
            return;
        }

        // 2. Find the brand (ensure opt.value is compared correctly)
        const selectedBrand = windowBrandOptions.find(opt => Number(opt.value) === brandId);

        console.log("Found Brand Object:", selectedBrand);

        const newWindow = {
            id: Date.now(),
            windowBrandId: brandId,
            brandName: selectedBrand ? selectedBrand.label : 'Marque inconnue',
            price: parseFloat(price)
        };

        setWindows([...windows, newWindow]);

        // Reset inputs
        methods.setValue("windowBrandId", "");
        methods.setValue("price", "");
        setError('');
    };

    const handleRemoveWindow = (id) => {
        setWindows(windows.filter(w => w.id !== id));
    };

    const handleFinalSubmit = () => {
        if (windows.length === 0) {
            setError('Ajoutez au moins une vitre avant de confirmer.');
            return;
        }
        // Sends the array of window objects to the parent
        const resultWindows = windows.map(win => ({
            windowBrandId: win.windowBrandId,
            orderId: Number(id),
            price: win.price
        }));
        onSubmit(resultWindows);
        handleClose();
    };

    const handleClose = () => {
        setWindows([]);
        methods.reset();
        setError('');
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h3>Ajouter les détails des vitres</h3>

                <FormProvider {...methods}>
                    <form className="search-form-layout">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>

                            {/* Reusing your custom Dropdown */}
                            <Dropdown {...window_brand_selection} options={windowBrandOptions} />

                            {/* Reusing your custom InputField */}
                            <InputField {...window_price_input} />

                            <SearchableDropdown
                                {...brand_validation}
                                options={brandOptions}
                            />
                            <SearchableDropdown
                                {...car_model_validation}
                                options={modelOptions}
                                // Optional: Disable if no brand selected
                            />

                            <button
                                type="button"
                                className="confirm-btn"
                                style={{ backgroundColor: '#5bc0de', width: '100%' }}
                                onClick={handleAddWindow}
                                disabled={isUpdating}
                            >
                                + Ajouter l'offre
                            </button>
                        </div>

                        {error && <p style={{ color: '#d9534f', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

                        {windows.length > 0 && (
                            <div className="modal-list-container custom-scrollbar">
                                <ul className="modal-item-list">
                                    {windows.map((win) => (
                                        <li key={win.id} className="modal-item">
                                            <div className="modal-item-info">
                                                <span className="modal-item-brand">{win.brandName}</span>
                                                <span className="modal-item-price">
                                                    {win.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="modal-item-remove"
                                                onClick={() => handleRemoveWindow(win.id)}
                                                aria-label="Supprimer"
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="modal-footer">
                            <button type="button" className="cancel-btn" onClick={handleClose}>
                                Annuler
                            </button>
                            <button
                                type="button" // Use type button to avoid triggering handleAddWindow
                                className="confirm-btn"
                                style={{ backgroundColor: '#5cb85c' }}
                                onClick={handleFinalSubmit}
                                disabled={isUpdating || windows.length === 0}
                            >
                                {isUpdating ? "Envoi..." : "Confirmer tout"}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
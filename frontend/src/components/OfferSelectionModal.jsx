import { useForm, FormProvider } from "react-hook-form";
import { useParams} from 'react-router';
import {Dropdown} from "./Input";
import {window_detail_selection} from '../validation/inputValidation';
import { useWindowDetailsSelection} from '../hooks/useWindowDetailsSelection'; // Import comment hook




export function OfferSelectionModal({ isOpen, onClose, onSubmit, isUpdating }) {
    const methods = useForm({
        defaultValues: {
            windowDetailId: '' // This will store the ID from the Dropdown
        }
    });
     const { id } = useParams();

    const windowDetailsOptions = useWindowDetailsSelection(id);

    if (!isOpen) return null;

   const onValidSubmit = () => {
    // data.windowDetailId is the ID from the dropdown
    const selectedId = methods.getValues("windowDetailId");
    console.log("window detail id in the Modala component " + selectedId)

    // Send only the ID to the parent component
    onSubmit(selectedId); 
    methods.reset(); 
    
    onClose();
};

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h3>sélectionnez la marque/ le prix de la vitre</h3>
                
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onValidSubmit)} className="search-form-layout">
                        <div className="form-row">
                            {/* Dropdown sends the ID as the value */}
                            <Dropdown {...window_detail_selection} options={windowDetailsOptions} />
                            
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
                                <button type="submit" className="confirm-btn" disabled={isUpdating}>
                                    {isUpdating ? "Chargement..." : "Valider"}
                                </button>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
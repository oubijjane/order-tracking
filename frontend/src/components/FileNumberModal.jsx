import { useForm, FormProvider } from "react-hook-form";
import {Dropdown, InputField} from "./Input";
import {file_number_validation } from '../validation/inputValidation';

export function FileNumberModal({ isOpen, onClose, onSubmit, isUpdating }) {
    const methods = useForm({
        defaultValues: {
            fileNumber: '' // This will store the ID from the Dropdown
        }
    });


    if (!isOpen) return null;

   const onValidSubmit = (data) => {
    // data.comment (or data.company) is the ID from the dropdown
    onSubmit(data.fileNumber);
    
    methods.reset(); 
    
    onClose();
};

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h3>Numer de dossier</h3>
                
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onValidSubmit)} className="search-form-layout">
                        <div className="form-row">
                            {/* Dropdown sends the ID as the value */}
                            <InputField {...file_number_validation } />
                            
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
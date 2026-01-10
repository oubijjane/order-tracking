import { useForm, FormProvider } from "react-hook-form";
import { Dropdown, InputField } from "./Input"; // Assuming you have a standard Input component
import { transit_company_search, declaration_number_input } from '../validation/inputValidation';
import { useTransitCompanySelection } from '../hooks/useTransitSelection'; // You'll need to create this hook

export function TransitModal({ isOpen, onClose, onSubmit, isUpdating }) {
    const methods = useForm({
        defaultValues: {
            transitCompanyId: '',
        }
    });

    // Custom hook to fetch transit company options (id and name)
    const companyOptions = useTransitCompanySelection();

    if (!isOpen) return null;

    const onValidSubmit = (data) => {
        // Sends (transitCompanyId, declarationNumber) to OrderDetailsPage
        onSubmit(data.transitCompanyId, data.declarationNumber);
        methods.reset(); // Clear form for next time
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h3>Informations de Transit</h3>
                
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onValidSubmit)} className="search-form-layout">
                        <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            
                            {/* Dropdown for Transit Company */}
                            <Dropdown {...transit_company_search} options={companyOptions} />
                            
                            {/* Standard Input for Declaration Number */}
                            <InputField {...declaration_number_input} />
                            
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
                                <button type="submit" className="confirm-btn" disabled={isUpdating}>
                                    {isUpdating ? "Chargement..." : "Confirmer l'envoi"}
                                </button>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
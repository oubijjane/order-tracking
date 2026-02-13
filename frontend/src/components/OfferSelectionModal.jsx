import { useForm, FormProvider } from "react-hook-form";
import { useParams} from 'react-router';
import {Dropdown, InputField, OrderCheckboxList} from "./Input";
import {window_detail_selection, Phone_number_input, additional_orders} from '../validation/inputValidation';
import { useWindowDetailsSelection} from '../hooks/useWindowDetailsSelection'; // Import comment hook
import { city_validation } from '../validation/inputValidation';
import { useCitySelection } from '../hooks/useCitySelection'; // Import city hook




export function OfferSelectionModal({ isOpen, onClose, onSubmit, isUpdating, groupedOrders = [] }) {
    const methods = useForm({
        defaultValues: {
            windowDetailId: '',
            phoneNumber: '',
            cityId: ''// This will store the ID from the Dropdown
        }
    });
     const { id } = useParams();

    const windowDetailsOptions = useWindowDetailsSelection(id);
    const cityOptions = useCitySelection(); // Placeholder if city dropdown is needed

    if (!isOpen) return null;

   const onValidSubmit = () => {
    // data.windowDetailId is the ID from the dropdown
    const selectedId = methods.getValues("windowDetailId");
    const cityId = methods.getValues("cityId");
    const phoneNumber = methods.getValues("phoneNumber");
    console.log("window detail id in the Modala component " + selectedId)

    // Send the ID, cityId, and phoneNumber to the parent component
    onSubmit(selectedId, cityId, phoneNumber); 
    methods.reset(); 
    
    onClose();
};

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h3>sélectionnez la marque/ le prix de la vitre et destination</h3>
                
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onValidSubmit)} className="search-form-layout">
                        <div className="form-row">
                            {/* Dropdown sends the ID as the value */}
                            <Dropdown {...window_detail_selection} options={windowDetailsOptions} />
                            <Dropdown {...city_validation} options={cityOptions} />
                            <InputField {...Phone_number_input} />
                            {/*<OrderCheckboxList {...additional_orders} orders={groupedOrders} />*/}
                            
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

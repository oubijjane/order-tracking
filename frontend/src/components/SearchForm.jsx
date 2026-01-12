import { useForm, FormProvider } from "react-hook-form";
import {InputField, Dropdown} from "./Input";
import { useCompanySelection } from '../hooks/useCompanySelection'; // Import company hook
import { useCitySelection } from '../hooks/useCitySelection'; // Import city hook
import { registration_number_search, status_search,
  company_search, city_search
} from '../validation/inputValidation';
import { ORDER_STATUS } from '../utils/formUtils';

function SearchForm({ onSearch }) { // Receive the prop
    const methods = useForm({
        defaultValues: {
            companyName: '', 
            cityName: '', // Ensure this matches your city logic
            registrationNumber: '',
            status: ''
        }
    });
    const companyOptions = useCompanySelection();
    const cityOptions = useCitySelection();
    const onValidSubmit = (data) => {
    // 1. Find the label in your options arrays using the ID from 'data'
    // Note: Use Number() if your IDs are stored as numbers in the DB
    const companyLabel = companyOptions.find(opt => opt.value === Number(data.companyId))?.label || '';
    const cityLabel = cityOptions.find(opt => opt.value === Number(data.cityId))?.label || '';

    // 2. Construct the search criteria using the labels (strings)
    const searchCriteria = {
        company: companyLabel,  // Sends "AXA" instead of "1"
        city: cityLabel,        // Sends "Casablanca" instead of "5"
        reg: data.registrationNumber,
        status: data.status
    };
    onSearch(searchCriteria);
};

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onValidSubmit)} className="search-form-layout">
                <div className="form-row">
                    <InputField {...registration_number_search} />
                    <Dropdown {...company_search} options={companyOptions} />
                    <Dropdown {...city_search} options={cityOptions} />
                    <Dropdown {...status_search} options={ORDER_STATUS} />
                    <button type="submit" className="search-btn">Rechercher</button>
                    
                    {/* Optional: Clear Filter button */}
                    <button type="button" className="reset-btn" onClick={() => { methods.reset(); onSearch({}); }}>Réinitialiser</button>
                </div>
            </form>
        </FormProvider>
    );
}

export default SearchForm;
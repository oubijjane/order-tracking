import { useForm, FormProvider } from "react-hook-form";
import { useState,useRef } from 'react';
import { useNavigate } from 'react-router';
import {InputField} from "./Input";
import transitCompanyService from '../services/transitCompanyService';
import {
  transit_company_name_search
} from '../validation/inputValidation';


function TransitCpmpanyForm() {
    const navigate = useNavigate();
    
    // 1. Setup Form
    const methods = useForm({
        defaultValues: {
            name: ''
        }
    });

    // 2. Use Custom Hook for Dropdown Data
    // We pass the watched value so the hook knows when to refetch models
    
    const [isUpdating, setIsUpdating] = useState(false);
    const submitLock = useRef(false);
   

    // 3. Handle Submit
   const onValidSubmit = async (data) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setIsUpdating(true);

    try {
        // Ensure data matches what your API expects (e.g., { name: "..." })
        await transitCompanyService.CreateNewTransitCompany(data);    
        navigate('/admin/Transport');
    } catch (error) {
        // Release the lock so they can fix and try again
        submitLock.current = false;

        if (error.response && error.response.status === 400) {
            const errorMessage = error.response.data.message;

            // FIX: Reference the specific field name from your validation object
            methods.setError(transit_company_name_search.name, { 
                type: "manual",
                message: errorMessage || "Cette société de transport est déjà enregistrée."
            });
        }
        console.error("Creation failed:", error);
    } finally {
        setIsUpdating(false);
    }
};

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onValidSubmit)} className="form-content" noValidate>
                
                {/* Text Inputs */}
                
                <InputField {...transit_company_name_search} />
                
                
                <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}

export default TransitCpmpanyForm;
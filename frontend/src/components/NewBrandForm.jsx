import { useForm, FormProvider } from "react-hook-form";
import { useState,useRef } from 'react';
import { useNavigate } from 'react-router';
import {InputField} from "./Input";
import brandService from '../services/brandService';
import {
  car_brand_validation
} from '../validation/inputValidation';


function BrandForm() {
    const navigate = useNavigate();
    
    // 1. Setup Form
    const methods = useForm({ 
        defaultValues: {
            brand: ''
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

        // 3. Send to Service
        await brandService.createBrand(data);    
        navigate('/admin/Marques');
    } catch (error) {
        if (error.response && error.response.status === 400) {
        // Option 1 & 2 both provide error.response.data.message
        const errorMessage = error.response.data.message;

        methods.setError("brand", {
            type: "manual",
            message: errorMessage || "la modele est déjà utilisé"
        });
    }
        submitLock.current = false;
    } finally {
        setIsUpdating(false);
    }
};

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onValidSubmit)} className="form-content" noValidate>
                
                {/* Text Inputs */}
                
                <InputField {...car_brand_validation} />
                
                
                <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}

export default BrandForm;
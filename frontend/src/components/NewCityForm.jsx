import { useForm, FormProvider } from "react-hook-form";
import { useState,useRef } from 'react';
import { useNavigate } from 'react-router';
import {InputField} from "./Input";
import cityService from '../services/cityService';
import {
  city_validation_text
} from '../validation/inputValidation';


function CityForm() {
    const navigate = useNavigate();
    
    // 1. Setup Form
    const methods = useForm({
        defaultValues: {
            cityName: ''
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
        await cityService.createCity(data);    
        console.log("city data " + data.cityName);
        navigate('/admin/Villes');
    } catch (error) {
        if (error.response && error.response.status === 400) {
        // Option 1 & 2 both provide error.response.data.message
        const errorMessage = error.response.data.message;

        methods.setError(city_validation_text.name, { // Dynamically uses the correct name
            type: "manual",
            message: errorMessage || "ville est déjà utilisé"
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
                
                <InputField {...city_validation_text} />
                
                
                <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}

export default CityForm;
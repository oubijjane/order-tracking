import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState,useRef } from 'react';
import { useNavigate } from 'react-router';
import {InputField, Dropdown} from "./Input";
import OrderService from '../services/orderService';
import { useCarSelection } from '../hooks/useCarSelection'; // Import your new hook
import { useCompanySelection } from '../hooks/useCompanySelection'; // Import company hook
import { useCitySelection } from '../hooks/useCitySelection'; // Import city hook
import { useImageResizer } from '../hooks/useImageResizer'; // Import image hook
import { WINDOW_TYPES, formatOrderPayload } from '../utils/formUtils'; // Import helpers
import {
  window_type_validation, image_validation,
  year_validation, registration_number_validation, car_model_validation, brand_validation,
  company_validation, city_validation
} from '../validation/inputValidation';

function Form() {
    const navigate = useNavigate();
    
    // 1. Setup Form
    const methods = useForm({
        defaultValues: {
            brandId: '',
            carModelId: '',
            companyName: '', 
            windowType: '',
            comment: '',
            destination: '',
            registrationNumber: '',
            status: 'En attente'
        }
    });

    // 2. Use Custom Hook for Dropdown Data
    // We pass the watched value so the hook knows when to refetch models
    const selectedBrand = methods.watch('brandId');
    const [isUpdating, setIsUpdating] = useState(false);
    const submitLock = useRef(false);
    const { brandOptions, modelOptions } = useCarSelection(selectedBrand);
    const { resizeMultipleImages, isProcessing } = useImageResizer();
    const companyOptions = useCompanySelection();
    const cityOptions = useCitySelection(); // Placeholder if city dropdown is needed

    // Optional: Reset model when brand changes (UX improvement)
    useEffect(() => {
        methods.setValue('carModelId', '');
    }, [selectedBrand, methods.setValue]);

    // 3. Handle Submit
    const onValidSubmit = async (data) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setIsUpdating(true);

    try {
        const payload = formatOrderPayload(data);

        // 1. Get files from the input (FileList -> Array)
        const rawFiles = data.images ? Array.from(data.images) : [];

        // 2. Resize all images (This returns an array of File objects)
        const processedImages = await resizeMultipleImages(rawFiles);

        // 3. Send to Service
        await OrderService.createOrder(payload, processedImages);    
        navigate('/');
    } catch (error) {
        console.error("Failed to create order:", error);
        submitLock.current = false;
    } finally {
        setIsUpdating(false);
    }
};

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onValidSubmit)} className="form-content" noValidate>
                
                {/* Text Inputs */}
                
                <InputField {...registration_number_validation} />
                <InputField {...image_validation} />
                
                {/* Dropdowns */}
                
                <Dropdown 
                    {...company_validation} 
                    options={companyOptions} 
                />
                
                <Dropdown 
                    {...window_type_validation} 
                    options={WINDOW_TYPES} 
                />
                
                
                <Dropdown 
                    {...brand_validation} 
                    options={brandOptions} 
                />
                <Dropdown 
                    {...car_model_validation} 
                    options={modelOptions}
                    // Optional: Disable if no brand selected
                    disabled={!selectedBrand} 
                />
                <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}
export default Form;
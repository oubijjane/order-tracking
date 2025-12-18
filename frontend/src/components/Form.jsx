import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router';
import {InputField, Dropdown} from "./Input";
import OrderService from '../services/orderService';
import { useCarSelection } from '../hooks/useCarSelection'; // Import your new hook
import { useCompanySelection } from '../hooks/useCompanySelection'; // Import company hook
import { WINDOW_TYPES, formatOrderPayload } from '../utils/formUtils'; // Import helpers
import {
  company_name_validation, window_type_validation, destination_validation,
  year_validation, registration_number_validation, car_model_validation, brand_validation,
  company_validation
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
            year: '',
            status: 'En attente'
        }
    });

    // 2. Use Custom Hook for Dropdown Data
    // We pass the watched value so the hook knows when to refetch models
    const selectedBrand = methods.watch('brandId');
    const { brandOptions, modelOptions } = useCarSelection(selectedBrand);
    const companyOptions = useCompanySelection();

    // Optional: Reset model when brand changes (UX improvement)
    useEffect(() => {
        methods.setValue('carModelId', '');
    }, [selectedBrand, methods.setValue]);

    // 3. Handle Submit
    const onValidSubmit = async (data) => {
        try {
            const payload = formatOrderPayload(data); // Logic is now hidden away
            await OrderService.createOrder(payload);
            navigate('/');
        } catch (error) {
            console.error("Failed to create order:", error);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onValidSubmit)} noValidate>
                
                {/* Text Inputs */}
                <InputField {...registration_number_validation} />
                <InputField {...year_validation} />
                <InputField {...destination_validation} />
                
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

                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}
export default Form;
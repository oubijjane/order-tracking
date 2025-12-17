import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from 'react-router';
import InputField from "./Input";
import OrderService from '../services/orderService';
import {
    company_name_validation, car_validation, destination_validation,
    year_validation, registration_number_validation, car_model_validation
} from '../validation/inputValidation';

function Form() {
    const navigate = useNavigate();
    const methods = useForm({
        defaultValues: {
            companyName: '',
            carName: '',
            carModel: '',
            comment: '',
            destination: '',
            image: '',
            registrationNumber: '',
            year: '',
            status: 'En attente'
        }
    });

    const onValidSubmit = async (data) => {
        try {
            await OrderService.createOrder(data);
            console.log("Order Created:", data);
            navigate('/');
        } catch (error) {
            console.error("Failed to create order:", error);
            // Optional: methods.setError('root', { message: 'Server error' })
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onValidSubmit)} noValidate>
                <InputField {...company_name_validation} />
                <InputField {...car_validation} />
                <InputField {...car_model_validation} />
                <InputField {...registration_number_validation} />
                <InputField {...year_validation} />
                <InputField {...destination_validation} />
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}

export default Form;
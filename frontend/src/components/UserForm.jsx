import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState,useRef } from 'react';
import { useNavigate } from 'react-router';
import {InputField, Dropdown} from "./Input";
import userService from '../services/userService';
import { WINDOW_TYPES, formatOrderPayload } from '../utils/formUtils'; // Import helpers
import {
  user_name_validation, email_validation,
  password_validation
} from '../validation/inputValidation';

function UserForm() {
    const navigate = useNavigate();
    
    // 1. Setup Form
    const methods = useForm({
        defaultValues: {
            username: '',
            password: '',
            email: ''
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
        const payload = formatOrderPayload(data);

        // 3. Send to Service
        await userService.createNewUser(payload);    
        navigate('/');
    } catch (error) {
        console.error("Failed to create user:", error);
        submitLock.current = false;
    } finally {
        setIsUpdating(false);
    }
};

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onValidSubmit)} className="form-content" noValidate>
                
                {/* Text Inputs */}
                
                <InputField {...user_name_validation} />
                <InputField {...password_validation} />
                <InputField {...email_validation} />
                
                <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}

export default UserForm;
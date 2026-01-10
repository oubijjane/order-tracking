import { useForm, FormProvider } from "react-hook-form";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { InputField, Dropdown } from "./Input";
import modelService from '../services/modelService';
import brandService from "../services/brandService";
import { formatNewUserPayload } from '../utils/formUtils'; // Import helpers
import {brand_validation, car_model_input} from '../validation/inputValidation';
import { useCitySelection } from "../hooks/useCitySelection";

function ModelFom() {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState("");
     
    
    // 1. Setup Form
    const methods = useForm({
        defaultValues: {
            model: '',
            brandId: ''
        }
    });

    // 2. Use Custom Hook for Dropdown Data
    // We pass the watched value so the hook knows when to refetch models

    const [isUpdating, setIsUpdating] = useState(false);
    const submitLock = useRef(false);
    const fetchBrands = async () => {
        let apiCall;
        apiCall = brandService.getAllBrands();
        apiCall.then(data => {
            setBrands(data);
        })
            .catch(err => {
                console.error("Failed:", err);
                setError("Could not load user. Is the backend running?");
            });
    }
    useEffect(() => {
        // Run both, then turn off loading
        fetchBrands();

    }, []);

    // 3. Handle Submit
    const onValidSubmit = async (data) => {
        if (submitLock.current) return;
        submitLock.current = true;
        setIsUpdating(true);

        try {
            

            // 3. Send to Service
            await modelService.createModel(data);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Option 1 & 2 both provide error.response.data.message
                const errorMessage = error.response.data.message;

                methods.setError("model", {
                    type: "manual",
                    message: errorMessage || "Ce model est déjà utilisé"
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

                {/* Model Name Input */}
                <InputField
                    {...car_model_input}
                />

                {/* Brand Dropdown */}
                <Dropdown
                    {...brand_validation}
                    options={brands.map(brand => ({ value: brand.id, label: brand.brand }))}

                />

                <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
            </form>
        </FormProvider>
    );
}

export default ModelFom;
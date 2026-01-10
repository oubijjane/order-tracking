import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState,useRef} from 'react';
import { useNavigate, useParams } from 'react-router';
import {InputField} from "./Input";
import cityService from '../services/cityService';
import {city_validation_text} from '../validation/inputValidation';


function EditCityForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    
    const [city, setCity] = useState([]);

   
    const fetchCity = async () => {
        setIsLoading(true);
        let apiCall;
        apiCall = cityService.getCityById(id);
        apiCall.then(data => {
            setCity(data);
            setIsLoading(false);
        }
    )
        .catch(err => {
            console.error("Failed:", err);
            setError("Could not load city. Is the backend running?");
        });
    }
    useEffect(() => {
    // Run both, then turn off loading
    fetchCity();
    
}, [id]);
    
    // 1. Setup Form
    const methods = useForm({
         defaultValues: {
    cityName: ''
  }
    });
    useEffect(() => {
  if (!city || !city.id) return;

  methods.reset({
    cityName: city.cityName || ''
  });
}, [city, methods]);

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
        await cityService.updateCity(id,data);    
        navigate('/');
    } catch (error) {
        if (error.response && error.response.status === 400) {
        // Option 1 & 2 both provide error.response.data.message
        const errorMessage = error.response.data.message;

        methods.setError(city_validation_text.name, { // Dynamically uses the correct name
            type: "manual",
            message: errorMessage || "ville est déjà utilisé"
        });
        console.error("Failed to :", error);
    }
    
        submitLock.current = false;
    } finally {
        setIsUpdating(false);
    }
};

    return (
        <>
                {isLoading ? (
                    <div className="loader">Chargement des statistiques...</div>
                ): (
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onValidSubmit)} className="form-content" noValidate>
                            
                            {/* Text Inputs */}
                            
                            <InputField {...city_validation_text} 
                                m
                            />
                            
                            <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
                        </form>
                    </FormProvider>
                )}
                </>);
}

export default EditCityForm;
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState,useRef} from 'react';
import { useNavigate, useParams } from 'react-router';
import {InputField} from "./Input";
import transitCompanyService from '../services/transitCompanyService';
import {transit_company_name_search} from '../validation/inputValidation';


function EditTransitForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    
    const [transitCompany, setTransitCompany] = useState([]);


   
    const fetchTransitCompany = async () => {
        setIsLoading(true);
        let apiCall;
        apiCall = transitCompanyService.getTransitCompanyById(id);
        apiCall.then(data => {
            setTransitCompany(data);
            setIsLoading(false);
        }
    )
        .catch(err => {
            console.error("Failed:", err);
            setError("Could not load transit company. Is the backend running?");
        });
    }
    useEffect(() => {
    // Run both, then turn off loading
    fetchTransitCompany();
    
}, [id]);
    
    // 1. Setup Form
    const methods = useForm({
         defaultValues: {
    name: ''
  }
    });
    useEffect(() => {
  if (!transitCompany || !transitCompany.id) return;

  methods.reset({
    name: transitCompany.name || ''
  });
}, [transitCompany, methods]);

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
        await transitCompanyService.updateTransitCompany(id,data);   
        console.log(data); 
        navigate('/admin/Transport');
    } catch (error) {
        if (error.response && error.response.status === 400) {
        // Option 1 & 2 both provide error.response.data.message
        const errorMessage = error.response.data.message;

        methods.setError(transit_company_name_search.name, { // Dynamically uses the correct name
            type: "manual",
            message: errorMessage || "transport est déjà utilisé"
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
                            
                            <InputField {...transit_company_name_search} 
                                m
                            />
                            
                            <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
                        </form>
                    </FormProvider>
                )}
                </>);
}

export default EditTransitForm;
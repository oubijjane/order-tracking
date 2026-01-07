import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState,useRef} from 'react';
import { useNavigate, useParams } from 'react-router';
import {InputField} from "./Input";
import companyService from '../services/companyService';
import {company_name_validation} from '../validation/inputValidation';


function EditUserForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    
    const [company, setCompany] = useState([]);

   
    const fetchCompany = async () => {
        setIsLoading(true);
        let apiCall;
        apiCall = companyService.getCompanyById(id);
        apiCall.then(data => {
            setCompany(data);
            setIsLoading(false);
        }
    )
        .catch(err => {
            console.error("Failed:", err);
            setError("Could not load user. Is the backend running?");
        });
    }
    useEffect(() => {
    // Run both, then turn off loading
    fetchCompany();
    
}, [id]);
    
    // 1. Setup Form
    const methods = useForm({
         defaultValues: {
    companyName: ''
  }
    });
    useEffect(() => {
  if (!company || !company.id) return;

  methods.reset({
    companyName: company.companyName || ''
  });
}, [company, methods]);

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
        await companyService.updateCompany(id,data);    
        navigate('/');
    } catch (error) {
        console.error("Failed to create user:", error);
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
                            
                            <InputField {...company_name_validation} />
                            
                            <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
                        </form>
                    </FormProvider>
                )}
                </>);
}

export default EditUserForm;
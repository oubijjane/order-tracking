import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState,useRef} from 'react';
import { useNavigate, useParams } from 'react-router';
import {Dropdown, InputField} from "./Input";
import commentService from '../services/commentService';
import {comment_validation, status_validation} from '../validation/inputValidation';


function EditCommentForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    const statusOptions = [
        {value: true, label: 'Actif'},
        {value: false, label: 'Inactif'}
    ];
    
    const [comment, setComment] = useState([]);

   
    const fetchCompany = async () => {
        setIsLoading(true);
        let apiCall;
        apiCall = commentService.getCommentById(id);
        apiCall.then(data => {
            setComment(data);
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
    comment: '',
    active: ''
  }
    });
    useEffect(() => {
  if (!comment || !comment.id) return;

  methods.reset({
    comment: comment.label || '',
    active: comment.active
  });
}, [comment, methods]);

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
        console.log("comment data " + data);
        await commentService.updateComment(id,data);    
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
                            
                            <InputField {...comment_validation} />
                            <Dropdown {...status_validation} options={statusOptions}/>
                            
                            <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
                        </form>
                    </FormProvider>
                )}
                </>);
}

export default EditCommentForm;
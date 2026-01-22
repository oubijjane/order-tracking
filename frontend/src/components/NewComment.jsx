import { useForm, FormProvider, set } from "react-hook-form";
import { useEffect, useState,useRef} from 'react';
import { useNavigate, useParams } from 'react-router';
import {Dropdown, InputField} from "./Input";
import commentService from '../services/commentService';
import {comment_validation, status_validation} from '../validation/inputValidation';


function CommentForm() {
    const navigate = useNavigate();
   

    
    // 1. Setup Form
    const methods = useForm({
         defaultValues: {
    comment: ''
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
        console.log("comment data " + data);
        await commentService.addNewComment(data);    
        navigate('/admin/Commentaires');
    } catch (error) {
        if (error.response && error.response.status === 400) {
                        // Option 1 & 2 both provide error.response.data.message
                        const errorMessage = error.response.data.message;
                
                        methods.setError(comment_validation.name, { // Dynamically uses the correct name
                            type: "manual",
                            message: errorMessage || "commentaire est déjà utilisé"
                        });
                    }
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
                            
                            <InputField {...comment_validation} />
                            
                            <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
                        </form>
                    </FormProvider>
                );
}
export default CommentForm;
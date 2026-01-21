import { useForm, FormProvider } from "react-hook-form";
import {Dropdown} from "./Input";
import {comment_search} from '../validation/inputValidation';
import { useCommentsSelection} from '../hooks/useCommentsSelection'; // Import comment hook



export function CommentModal({ isOpen, onClose, onSubmit, isUpdating }) {
    const methods = useForm({
        defaultValues: {
            comment: '' // This will store the ID from the Dropdown
        }
    });

    const commentOptions = useCommentsSelection();

    if (!isOpen) return null;

   const onValidSubmit = (data) => {
    // data.comment (or data.company) is the ID from the dropdown
    const selectedId = data[comment_search.name];; 
    console.log("reason id in the Modala component " + selectedId)

    // Send only the ID to the parent component
    onSubmit(selectedId); 
    methods.reset(); 
    
    onClose();
};

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h3>Ajouter un commentaire</h3>
                
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onValidSubmit)} className="search-form-layout">
                        <div className="form-row">
                            {/* Dropdown sends the ID as the value */}
                            <Dropdown {...comment_search} options={commentOptions} />
                            
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={onClose}>Annuler</button>
                                <button type="submit" className="confirm-btn" disabled={isUpdating}>
                                    {isUpdating ? "Chargement..." : "Valider"}
                                </button>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
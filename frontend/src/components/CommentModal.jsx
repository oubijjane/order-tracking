import { useForm, FormProvider } from "react-hook-form";
import {InputField} from "./Input";
import {comment_validation} from '../validation/inputValidation';
import { useCommentsSelection} from '../hooks/useCommentsSelection'; // Import comment hook



export function CommentModal({ isOpen, onClose, onSubmit, isUpdating }) {
    const methods = useForm({
        defaultValues: {
        // This will store the ID from the Dropdown
            additionalComment: ''
        }
    });

    const commentOptions = useCommentsSelection();

    if (!isOpen) return null;

   const onValidSubmit = (data) => {
    // data.comment is the ID from the dropdown, data.additionalComment is free text
    const additional = data.additionalComment || null;
    console.log("reason id in the Modala component " + additional);

    // Send the ID and the optional additional comment to the parent component
    onSubmit(additional);
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
                            <InputField label="Commentaire additionnel" name="additionalComment" placeholder="Texte additionnel (optionnel)" type="text" />
                            
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
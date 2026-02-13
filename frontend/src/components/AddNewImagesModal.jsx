import { useForm, FormProvider } from "react-hook-form";
import {InputField} from "./Input";
import {image_validation} from '../validation/inputValidation';
import { useImageResizer } from '../hooks/useImageResizer'; 




export function ImagesModal({ isOpen, onClose, onSubmit, isUpdating }) {
    const methods = useForm({
        defaultValues: {
        // This will store the ID from the Dropdown
            additionalComment: ''
        }
    });

    const { resizeMultipleImages, isProcessing } = useImageResizer();

    

    if (!isOpen) return null;

   const onValidSubmit = async (data) => {
    // data.comment is the ID from the dropdown, data.additionalComment is free text
    const rowImages = data.images ? Array.from(data.images) : [];
    console.log("reason id in the Modala component " + rowImages);

    const processedImages = await resizeMultipleImages(rowImages);

    // Send the ID and the optional additional comment to the parent component
    onSubmit(processedImages);
    methods.reset(); 
    
    onClose();
};

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <h3>Ajouter des images</h3>
                
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onValidSubmit)} className="search-form-layout">
                        <div className="form-row">
                            {/* Dropdown sends the ID as the value */}
                            <InputField {...image_validation} />
                            
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
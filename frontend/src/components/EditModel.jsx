import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState,useRef} from 'react';
import { useNavigate, useParams } from 'react-router';
import {InputField, Dropdown} from "./Input";
import modelService from '../services/modelService';
import brandService from '../services/brandService';
import {brand_validation, car_model_input} from '../validation/inputValidation';



function EditModelForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    // Use null or object instead of empty array for a single item
    const [modelData, setModelData] = useState(null);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const submitLock = useRef(false);

    const methods = useForm({
        defaultValues: {
            model: '',
            brandId: ''
        }
    });

    // Fetch Brand list and the specific Model data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const brandsData = await brandService.getAllBrands();
                setBrands(brandsData);

                const specificModel = await modelService.getModelById(id);
                setModelData(specificModel);
                
                // Reset form with data from backend
                methods.reset({
                    model: specificModel.model,
                    // If your backend CarModel has a Brand object, extract the ID
                    brandId: specificModel.carBrand?.id || '' 
                });
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load data.");
            }
        };

        loadInitialData();
    }, [id, methods]);

    const onValidSubmit = async (data) => {
        if (submitLock.current) return;
        submitLock.current = true;
        setIsUpdating(true);

        try {
            // FIX: Use modelService instead of companyService
            await modelService.updateModel(id, {
                model: data.model,
                brandId: parseInt(data.brandId, 10)
            });    
            navigate('/admin/Modèles'); // Navigate back to the list
        } catch (error) {
            if (error.response && error.response.status === 400) {
        // Option 1 & 2 both provide error.response.data.message
        const errorMessage = error.response.data.message;

        methods.setError("model", {
            type: "manual",
            message: errorMessage || "Ce model est déjà utilisé"
        });
    }
            console.error("Failed to create user:", error);
            submitLock.current = false;
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Modifier le Modèle</h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onValidSubmit)} className="form-content">
                    
                    {/* Model Name Input */}
                    <InputField 
                        {...car_model_input}
                    />

                    {/* Brand Dropdown */}
                    <Dropdown 
                        {...brand_validation}
                        options={brands.map(brand => ({ value: brand.id, label: brand.brand }))}
                       
                    />

                    <button 
                        className={isUpdating ? "disabled-button" : "enabled-button"} 
                        type="submit"
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Mise à jour..." : "Enregistrer"}
                    </button>
                </form>
            </FormProvider>
        </div>
    );
}
export default EditModelForm;
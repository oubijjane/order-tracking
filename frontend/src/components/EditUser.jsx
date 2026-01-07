import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState,useRef, use } from 'react';
import rolesService from '../services/rolesService';
import { useNavigate, useParams } from 'react-router';
import { useCitySelection } from "../hooks/useCitySelection";
import {useRoleSelection} from '../hooks/useRoleSelection';
import {InputField, Dropdown} from "./Input";
import userService from '../services/userService';
import {useCompanySelection} from "../hooks/useCompanySelection";
import { formatEditUserPayload } from '../utils/formUtils';
import {user_name_validation, email_validation, company_multi_select,
    password_validation_edit, city_validation, role_one_select, status_validation
    } from '../validation/inputValidation';


function EditUserForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    const cityOptions = useCitySelection();
    const roleOptions = useRoleSelection();
    const companyOptions = useCompanySelection();
    
    const [user, setUser] = useState({});
    const [roles, setRoles] = useState([]);
    const userStatusOptions = [
        {value: true, label: 'Actif'},
        {value: false, label: 'Inactif'}
    ];
    
   
    const fetchUser = async () => {
        setIsLoading(true);
        let apiCall;
        apiCall = userService.getUserById(id);
        apiCall.then(data => {
            setUser(data);
            data.companies.map(c => console.log("companie name " + c.id.companyId ));
            data.roles.map(r => console.log("role name " + r.id.roleId ));
            setIsLoading(false);
        }
    )
        .catch(err => {
            console.error("Failed:", err);
            setError("Could not load user. Is the backend running?");
        });
    }
    const fetchRoles = async () => {
        let apiCall;
        apiCall = rolesService.getAllRoles();
        apiCall.then(data => {
            setRoles(data);
        })
        .catch(err => {
            console.error("Failed:", err);
            setError("Could not load roles. Is the backend running?");
        });
    }
    useEffect(() => {
    // Run both, then turn off loading
    fetchUser();
    fetchRoles();
    
}, [id]);
    
    // 1. Setup Form
    const methods = useForm({
         defaultValues: {
    username: '',
    password: '',
    email: '',
    status: true,
    companies: [],
    roles: [],
    cityId: ''
  }
    });
    useEffect(() => {
  if (!user || !user.id) return;

  methods.reset({
    username: user.username || '',
    password: '',
    email: user.email || '',
    status: user.isActive,
    companies: user.companies
      ? user.companies.map(c => String(c.id.companyId))
      : [],
    roles: user.roles
      ? user.roles.map(r => String(r.id.roleId))
      : [],
    cityId: user.city?.id ? String(user.city.id) : ''
  });
}, [user, methods]);

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
        const payload = formatEditUserPayload(data);

        // 3. Send to Service
        await userService.updateUser(id,payload);    
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
                            
                            <InputField {...user_name_validation} />
                            <InputField {...password_validation_edit} />
                            <InputField {...email_validation} />
                            <Dropdown 
                                {...city_validation} 
                                options={cityOptions} 
                            />
                            <Dropdown {...status_validation} options={userStatusOptions} />
                            <Dropdown {...role_one_select} options={roleOptions} />
                            <Dropdown {...company_multi_select} options={companyOptions} multiple={true} />
                            
                            <button className={isUpdating ? "disabled-button" : "enabled-button"} type="submit">Submit</button>
                        </form>
                    </FormProvider>
                )}
                </>);
}

export default EditUserForm;
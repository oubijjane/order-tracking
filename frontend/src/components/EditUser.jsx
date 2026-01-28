import { useForm, FormProvider, Controller } from "react-hook-form";
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import userService from '../services/userService';
import rolesService from '../services/rolesService';
import { useCitySelection } from "../hooks/useCitySelection";
import { useRoleSelection } from "../hooks/useRoleSelection";
import { useCompanySelection } from "../hooks/useCompanySelection";
import { InputField, Dropdown } from "./Input";
import { formatEditUserPayload } from '../utils/formUtils';
import {
  user_name_validation,
  password_validation_edit,
  email_validation,
  city_validation,
  role_one_select,
  company_multi_select,
  status_validation
} from '../validation/inputValidation';

function EditUserForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const cityOptions = useCitySelection();
  const roleOptions = useRoleSelection();
  const companyOptions = useCompanySelection();

  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const submitLock = useRef(false);

  const methods = useForm({
    defaultValues: {
      username: '',
      password: '',
      email: '',
      status: true,
      companies: [],
      secondaryCompanies: [],
      roles: [],
      cityId: ''
    }
  });

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUserById(id);
      // Reset form values
      methods.reset({
        username: data.username || '',
        password: '',
        email: data.email || '',
        status: data.status,
        companies: data.companies?.map(String) || [],
        secondaryCompanies: data.secondaryCompanies?.map(String) || [],
        roles: data.roles?.map(String) || [],
        cityId: data.cityId ? String(data.cityId) : ''
      });
      console.log("Fetched user data:", data);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await rolesService.getAllRoles();
      setRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [id]);

  const onValidSubmit = async (data) => {
    if (submitLock.current) return;
    submitLock.current = true;

    try {
      const payload = formatEditUserPayload(data);
      await userService.updateUser(id, payload);
      navigate('/admin/Utilisateurs');
    } catch (error) {
      console.error("Failed to update user:", error);
      submitLock.current = false;
    }
  };

  const userStatusOptions = [
    { value: true, label: 'Actif' },
    { value: false, label: 'Inactif' }
  ];

  if (isLoading) return <div className="loader">Chargement des statistiques...</div>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onValidSubmit)} className="form-content" noValidate>
        {/* Text Inputs */}
        <InputField {...user_name_validation} />
        <InputField {...password_validation_edit} />
        <InputField {...email_validation} />

        {/* City Dropdown */}
        <Controller
          name="cityId"
          control={methods.control}
          render={({ field }) => (
            <Dropdown {...city_validation} {...field} options={cityOptions} />
          )}
        />

        {/* Status Dropdown */}
        <Controller
          name="status"
          control={methods.control}
          render={({ field }) => (
            <Dropdown {...status_validation} {...field} options={userStatusOptions} />
          )}
        />

        {/* Roles Dropdown (single-select) */}
        <Controller
          name="roles"
          control={methods.control}
          render={({ field }) => (
            <Dropdown {...role_one_select} {...field} options={roleOptions} multiple={false} />
          )}
        />

        {/* Primary Companies */}
        <Controller
          name="companies"
          control={methods.control}
          render={({ field }) => (
            <Dropdown
              {...company_multi_select}
              {...field}
              options={companyOptions}
              multiple
              id="companies-primary"
              value={field.value || []}
              onChange={field.onChange}
            />
          )}
        />

        {/* Secondary Companies */}
        <Controller
          name="secondaryCompanies"
          control={methods.control}
          render={({ field }) => (
            <Dropdown
              {...company_multi_select}
              {...field}
              options={companyOptions}
              multiple
              id="companies-secondary"
              label="Assurance secondaire"
              value={field.value || []}
              onChange={field.onChange}
            />
          )}
        />

        <button type="submit" className="enabled-button">Submit</button>
      </form>
    </FormProvider>
  );
}

export default EditUserForm;

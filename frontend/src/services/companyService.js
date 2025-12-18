import api from './api';

// 1. Read company
const getAllCompanies = async () => {
    try {
        const response = await api.get('/companies');  
        return response.data; // CRITICAL: This passes the data back to the caller
    } catch (error) {
        console.error("Error fetching companies:", error);
        throw error;
    }  
};

const getCompanyById = async (id) => {
    try {
        const response = await api.get(`/companies/${id}`); 
        return response.data; // CRITICAL: This passes the data back to the caller
    } catch (error) {
        console.error("Error fetching company with ID: " + id, error);
        throw error;
    }   
};

const createCompany = async (companyData) => {
    try {
        const response = await api.post('/companies', companyData);
        return response.data; // CRITICAL: This passes the data back to the caller
    } catch (error) {
        console.error("Error creating company:", error);
        throw error;
    }
};

const updateCompany = async (id, companyData) => {
    try {
        const response = await api.put(`/companies/${id}`, companyData);    
        return response.data; // CRITICAL: This passes the data back to the caller
    } catch (error) {
        console.error("Error updating company with ID: " + id, error);
        throw error;
    }
};
// EXPORT DEFAULT: This bundles the functions into one object
export default {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany
};
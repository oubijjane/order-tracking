import api from './api';


const getTransitCompany = async () => {
    try {
        const response = await api.get('/transit-company');
        return response.data; // CRITICAL: This passes the data back to App.
        } catch (error) {
        console.error("Error fetching transit company:", error);
        throw error;
    }
};

const getTransitCompanyById = async (id) => {
    try {
        const response = await api.get(`/transit-company/${id}`);
        return response.data; // CRITICAL: This passes the data back to App.  
    } catch (error) {
        console.error("Error fetching transit company with ID: " + id, error);
        throw error;
    }
};

const updateTransitCompany = async (id, data) => {
    try {
        const response = await api.put(`/transit-company/${id}`, data);
        return response.data; // CRITICAL: This passes the data back to App.  
    } catch (error) {
        console.error("Error updating transit company with ID: " + id, error);
        console.log("heloooo");
        throw error;
    }
};
const CreateNewTransitCompany = async (data) => {
    try {
        const response = await api.post(`/transit-company`, data);
        return response.data; // CRITICAL: This passes the data back to App.  
    } catch (error) {
        console.error("Error updating transit company with ID: " + error);
        throw error;
    }
};


export default {
    getTransitCompany,
    getTransitCompanyById,
    updateTransitCompany,
    CreateNewTransitCompany

}
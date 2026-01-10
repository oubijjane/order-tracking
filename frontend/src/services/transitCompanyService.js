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


export default {
    getTransitCompany,
    getTransitCompanyById

}
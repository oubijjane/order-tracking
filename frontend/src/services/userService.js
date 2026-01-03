import api from './api';

const getAllusers= async () => {
        try {
            const response = await api.get('/users');
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    };

    const getUserCompanies = async (id) => {
    try {
        const response = await api.get(`/users/${id}/companies`);
        return response.data; // CRITICAL: This passes the data back to App.jsx
    } catch (error) {
        console.error("Error fetching user companies with ID: " + id, error);
        throw error;
    }
};

const createNewUser = async (userData) => {
    try {
        const response = await api.put(`/users/`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating new user:", error);
        throw error;
    }
};

export default {
    getAllusers,
    getUserCompanies,
    createNewUser
}


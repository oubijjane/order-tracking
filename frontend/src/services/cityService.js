import api from './api';

// 1. Get All Cities
    const getAllCities = async () => {
        try {
            const response = await api.get('/cities');
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching cities:", error);
            throw error;
        }
    };

const getCityById = async (id) => {
    try {
        const response = await api.get(`/cities/${id}`);
        return response.data; // CRITICAL: This passes the data back to App.jsx
    } catch (error) {
        console.error("Error fetching city with ID: " + id, error);
        throw error;
    }
};

// 2. Create city      
const createCity = async (cityData) => {
    try {
        const response = await api.post('/cities', cityData);
        return response.data;
    } catch (error) {
        console.error("Error creating city:", error);
        throw error;
    }
};

// 3. Update City
const updateCity = async (id, cityData) => {
    try {
        const response = await api.put(`/cities/${id}`, cityData);
        return response.data;
    } catch (error) {
        console.error("Error updating city:", error);
        throw error;
    }
};

// 4. Delete City          
const deleteCity = async (id) => {
    try {
        const response = await api.delete(`/cities/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting city:", error);
        throw error;
    }
};



// EXPORT DEFAULT: This bundles the functions into one object
export default {
    getAllCities,
    getCityById,
    createCity,
    updateCity,
    deleteCity 
};
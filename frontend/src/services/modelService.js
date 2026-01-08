import api from './api';

// 1. Get All Models
    const getAllModels = async (page, size) => {
        try {
            const response = await api.get('/models', {
                params: {
                    page,
                    size
                }
            });
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching models:", error);
            throw error;
        }
    };

const getModelById = async (id) => {
    try {
        const response = await api.get(`/models/${id}`);
        return response.data; // CRITICAL: This passes the data back to App.jsx
    } catch (error) {
        console.error("Error fetching model with ID: " + id, error);
        throw error;
    }
};
const getModelByBrand = async (id) => {
    try {
        const response = await api.get(`/models/brand/${id}`);
        return response.data; // CRITICAL: This passes the data back to App.jsx
    } catch (error) {
        console.error("Error fetching model with brand ID: " + id, error);
        throw error;
    }
};

// 2. Create Model
const createModel = async (modelData) => {
    try {
        const response = await api.post('/models', modelData);
        return response.data;
    } catch (error) {
        console.error("Error creating model:", error);
        throw error;
    }
};
// 3. Update Model
const updateModel = async (id, modelData) => {
    try {
        const response = await api.put(`/models/${id}`, modelData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating model:", error);
        throw error;
    }
};

// 4. Delete Model          
const deleteModel = async (id) => {
    try {
        const response = await api.delete(`/models/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting model:", error);
        throw error;
    }
};



// EXPORT DEFAULT: This bundles the functions into one object
export default {
    getAllModels,
    getModelById,
    createModel,
    updateModel,
    deleteModel,
    getModelByBrand 
};
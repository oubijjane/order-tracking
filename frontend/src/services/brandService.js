import api from './api';

// 1. Get All Brandsd
    const getAllBrands = async () => {
     
        try {
            const response = await api.get('/brands');
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching brands:", error);
            throw error;
        }
    };

const getBrandById = async (id) => {
    try {
        const response = await api.get(`/brands/${id}`);
        return response.data; // CRITICAL: This passes the data back to App.jsx
    } catch (error) {
        console.error("Error fetching brand with ID: " + id, error);
        throw error;
    }
};

// 2. Create Brand      
const createBrand = async (brandData) => {
    try {
        const response = await api.post('/brands', brandData);
        return response.data;
    } catch (error) {
        console.error("Error creating brand:", error);
        throw error;
    }
};
// 3. Update Brand
const updateBrand = async (id, brandData) => {
    try {
        const response = await api.put(`/brands/${id}`, brandData);
        return response.data;
    } catch (error) {
        console.error("Error updating brand:", error);
        throw error;
    }
};

// 4. Delete Brand          
const deleteBrand = async (id) => {
    try {
        const response = await api.delete(`/brands/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting brand:", error);
        throw error;
    }
};



// EXPORT DEFAULT: This bundles the functions into one object
export default {
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand 
};
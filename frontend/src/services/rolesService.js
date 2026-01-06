import api from './api';

const getAllRoles= async () => {
        try {
            const response = await api.get('/roles');
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching roles:", error);
            throw error;
        }
    };

export default {
    getAllRoles
}
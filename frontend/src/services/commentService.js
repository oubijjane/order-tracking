import api from './api';

 const getAllActiveComments = async () => {
        try {
            const response = await api.get('/comments');
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    };

export default {
    getAllActiveComments
}

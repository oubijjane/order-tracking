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

    const getAllComments = async () => {
        try {
            const response = await api.get('/comments/all');
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    };

    const getCommentById = async (id) => {
        try {
            const response = await api.get(`/comments/${id}`);
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching comments:", error);
            throw error;
        }
    };

    const updateComment = async (id, commentData) => {
        const request = {
            label: commentData.comment,
            active: commentData.status
        }
        try {
            const response = await api.put(`/comments/${id}`, request);
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error updating comments:", error);
            throw error;
        }
    };
    const addNewComment = async (commentData) => {
        const request = {
            label: commentData.comment
        }
        try {
            const response = await api.post(`/comments`, request);
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error adding new comment:", error);
            throw error;
        }
    };


export default {
    getAllActiveComments,
    getAllComments,
    getCommentById,
    updateComment,
    addNewComment
}

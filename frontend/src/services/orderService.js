import api from './api';

// 1. Get All Orders
const getAllOrders = async () => {
    try {
        const response = await api.get('/orders');
        return response.data; // CRITICAL: This passes the data back to App.jsx
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

const getOrderById = async (id) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return response.data; // CRITICAL: This passes the data back to App.jsx
    } catch (error) {
        console.error("Error fetching order with ID: " + id, error);
        throw error;
    }
};

// 2. Create Order
const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

// 3. Delete Order
const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
};

// EXPORT DEFAULT: This bundles the functions into one object
export default {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder
};
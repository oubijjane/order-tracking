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

    const getOrderCountByStatus = async () => {
        try {
            const response = await api.get('/orders/count');
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching order counts:", error);
            throw error;
        }
    };

    const getOrderByStatus = async (status, size=9, page=0) => {
        try {
            const response = await api.get(`/orders/status?status=${status}&size=${size}&page=${page}`);
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching order counts:", error);
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

const createOrder = async (jsonData, imageFile) => {
    try {
        const formData = new FormData();

        // A. Add the JSON Data (Must be stringified and blobbed)
        const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        formData.append("data", jsonBlob);

        // B. Add the Image File (If provided)
        if (imageFile) {
            formData.append("image", imageFile);
        }

        // C. Send as Multipart
        // Note: We send 'formData', NOT 'orderData'
        const response = await api.post('/orders', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};
// 3. Update Order
const updateOrder = async (id, orderData) => {
    try {
        const response = await api.put(`/orders/${id}`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
};

// 4. Delete Order
const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
};

const handleDecision = async (id, decision) => {
    try {
    // decision must be the EXACT string: 'VALIDATED' or 'REJECTED'
    await api.patch(`/orders/${id}/status?status=${decision}`);
    } catch (error) {
        console.error("Error handling decision for order:", error);
        throw error;
    }
    
};



// EXPORT DEFAULT: This bundles the functions into one object
export default {
    getAllOrders,
    getOrderCountByStatus,
    getOrderByStatus,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    handleDecision
};
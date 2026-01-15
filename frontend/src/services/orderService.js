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
// 2. Create Order with JSON and Multiple Images
const createOrder = async (jsonData, imageFiles) => {
    try {
        const formData = new FormData();

        // A. Add the JSON Data
        const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        formData.append("data", jsonBlob);

        // B. Add Multiple Image Files
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach(file => {
                formData.append("images", file); // Must match @RequestPart("images")
            });
        }

        const response = await api.post('/orders', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
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


const handleDecision = async (id, decision, commentId = null, newTransitCompanyId = null, newDeclarationNumber, newFileNumber) => {
    let updateData;
    console.log("file number: " + newFileNumber)
    console.log("decision: " + decision)
    try {
        if (decision == "CANCELLED") {
             updateData = {
                orderStatus: decision, // e.g., 'CANCELLED'
                comment: commentId   // This will now be 3
            };
        }else if(decision == "IN_TRANSIT") {
             updateData = {
                orderStatus: decision, // e.g., 'CANCELLED'
                transitCompanyId: newTransitCompanyId,
                declarationNumber: newDeclarationNumber
            };
        }else if (newFileNumber && !decision) {
            updateData = {
                fileNumber: newFileNumber
            };
        } else {
             updateData = {
                orderStatus: decision,// This will now be 3
            };
        }


        // This sends the JSON body { "orderStatus": "CANCELLED", "commentId": 3 }
        return await api.patch(`/orders/${id}`, updateData);
        
    } catch (error) {
        console.error("Axios Error:", error);
        throw error;
    }
};
const getFilteredOrders = async (company, status, registrationNumber, city, size=9, page=0) => {
        try {
            const response = await api.get('/orders/filter', {
               params: {
        company,
        status,
        reg: registrationNumber, // Match the backend key
        city,
        size,
        page
    }
            });
            return response.data; // CRITICAL: This passes the data back to App.jsx
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    };



// For the Excel Export (BLOB)
const downloadExcelReport = async (company, status, registrationNumber, city) => {
    try {
        const response = await api.get('/orders//export', {
            params: {
                companyName: company,
                status: status,
                registrationNumber: registrationNumber,
                cityName: city
            },
            responseType: 'blob' // CRITICAL for SXSSFWorkbook binary stream
        });
        return response; 
    } catch (error) {
        console.error("Excel download error:", error);
        throw error;
    }
};



// EXPORT DEFAULT: This bundles the functions into one object
export default {
    getAllOrders,
    getOrderCountByStatus,
    getOrderByStatus,
    getFilteredOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    handleDecision,
    downloadExcelReport
};
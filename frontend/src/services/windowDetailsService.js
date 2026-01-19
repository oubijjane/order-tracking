import api from './api';

const getOrderWindowDetails = async (id) => {
  const response = await api.get(`/window-details/${id}`);
  return response.data;
};

const updateOrderWindowDetails = async (id, windowDetailsData) => {
  try {
    const response = await api.put(`/window-details/${id}`, windowDetailsData);
    return response.data;
  } catch (error) {
    console.error("Error updating order window details:", error);
    throw error;
  }
};

const addNewWindowDetails = async (windowDetailsData) => {
  try {
    const response = await api.post('/window-details', windowDetailsData);
    return response.data;
  } catch (error) {
    console.error("Error adding new window details:", error);
    throw error;
  }
};

const deleteNonSelectedWindowDetails = async (id) => {
  try {
    const response = await api.delete(`/window-details/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting window details:", error);
    throw error;
  }
};

export default {
  getOrderWindowDetails,
  updateOrderWindowDetails,
  addNewWindowDetails,
  deleteNonSelectedWindowDetails
};
import api from "./api";

const getWindowBands = async () => {
  try {
    const response = await api.get(`/window-brands`);
    return response.data;
  } catch (error) {
    console.error("Error fetching window bands:", error);
    throw error;
  }
};

export default {
  getWindowBands
};
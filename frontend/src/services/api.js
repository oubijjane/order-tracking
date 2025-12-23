import axios from 'axios';

// Create a configured instance of Axios
const api = axios.create({
    baseURL: 'http://192.168.1.242:8080/api', // This must match your Spring Boot Controller path
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // This is where we save it after login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
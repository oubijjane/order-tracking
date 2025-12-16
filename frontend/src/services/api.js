import axios from 'axios';

// Create a configured instance of Axios
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // This must match your Spring Boot Controller path
    auth: {
        username: 'admin',      // REPLACE with your Spring Security Username
        password: '123'    // REPLACE with your Spring Security Password
    }
});

export default api;
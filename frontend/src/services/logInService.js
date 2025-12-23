import api from './api';

const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', {
            username: username, // Make sure this matches your User entity field name
            password: password
        });

        // The backend returns { token: "eyJhbG..." }
        const token = response.data.token;
        
        // Store it so the interceptor above can find it
        localStorage.setItem('token', token);
        
        console.log("Logged in successfully!");
    } catch (error) {
        console.error("Login failed", error.response.data);
    }
};

export default login
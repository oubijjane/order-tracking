import api from './api';

const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', {
            username: username,
            password: password
        });

        // 1. Get the whole object
        const data = response.data; 
        
        // 2. Store the token separately
        localStorage.setItem('token', data.token);
        
        // 3. Store the rest as the 'user' object
        // We remove the token from this object so we don't store it twice
        const { token, ...userWithoutToken } = data;
        localStorage.setItem('user', JSON.stringify(userWithoutToken));
        return userWithoutToken; 
    } catch (error) {
        console.error("Login failed", error.response?.data);
        throw error;
    }
};

export default login
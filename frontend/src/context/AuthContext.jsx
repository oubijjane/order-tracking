import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { getMessaging, deleteToken } from 'firebase/messaging';
import { app } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On load, check localStorage or call your /me backend endpoint
        const savedUser = localStorage.getItem('user');
        if (savedUser && savedUser !== "undefined") {
        try {
            setUser(JSON.parse(savedUser));
        } catch (e) {
            localStorage.removeItem('user');
        }
    }
    setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log("User logged in:", userData);
    };

    const logout = async () => {
        try {
            const LAST_TOKEN_KEY = 'fcm_token';
            const token = localStorage.getItem(LAST_TOKEN_KEY);
            if (token) {
                // Ask backend to remove this device token
                try {
                    await api.delete('/devices', { params: { token } });
                    console.log('Device token removed from backend');
                } catch (e) {
                    console.warn('Failed to remove device token from backend', e);
                }

                // Try to delete the token locally via Firebase
                try {
                    const messaging = getMessaging(app);
                    await deleteToken(messaging);
                    console.log('FCM token deleted from client');
                } catch (e) {
                    console.warn('Failed to delete FCM token from client', e);
                }

                // Clean local storage key
                localStorage.removeItem(LAST_TOKEN_KEY);
            }
        } catch (e) {
            console.warn('Error during logout token cleanup', e);
        }

        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Clear your JWT
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
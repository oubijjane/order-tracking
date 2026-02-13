// src/fcm/registerDevice.js
import api from '../api'; // your Axios instance

export const registerDeviceToken = async (token) => {
  try {
    // POST token to backend
    await api.post('/devices', { token });
    console.log('Device token registered:', token);
  } catch (err) {
    console.error('Failed to register device token:', err);
  }
};
import axios from 'axios';

const API_URL = 'http://localhost:5121'; // Ajuste a porta conforme sua API

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  }
};
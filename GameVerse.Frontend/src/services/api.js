// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5121/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Erro de conexão - verifique se o backend está rodando');
      // Poderia mostrar um toast/notification
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', {
    fullName: userData.fullName,
    username: userData.username,
    email: userData.email,
    password: userData.password
  }),
  login: (credentials) => api.post('/auth/login', {
    identifier: credentials.identifier, // Pode ser email ou username
    password: credentials.password
  }),
  getMe: () => api.get('/auth/me'),
};

export const gamesAPI = {
  getAll: () => api.get('/games'),
  getById: (id) => api.get(`/games/${id}`),
  create: (gameData) => api.post('/games', {
    title: gameData.title,
    description: gameData.description,
    genre: gameData.genre,
    status: gameData.status
  }),
  update: (id, gameData) => api.put(`/games/${id}`, {
    title: gameData.title,
    description: gameData.description,
    genre: gameData.genre,
    status: gameData.status
  }),
  delete: (id) => api.delete(`/games/${id}`),
};

export const postsAPI = {
  getAll: () => api.get('/posts'),
  getById: (id) => api.get(`/posts/${id}`),
  create: (postData) => api.post('/posts', {
    title: postData.title,
    bodyContent: postData.bodyContent,
    gameId: postData.gameId,
    postType: postData.postType || 'devlog'
  }),
  update: (id, postData) => api.put(`/posts/${id}`, {
    title: postData.title,
    bodyContent: postData.bodyContent,
    gameId: postData.gameId,
    postType: postData.postType || 'devlog'
  }),
  delete: (id) => api.delete(`/posts/${id}`),
};

export default api;

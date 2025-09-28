// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await authAPI.getMe();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        
        // Buscar dados do usuário após login
        const userResponse = await authAPI.getMe();
        setUser(userResponse.data);
      }
      
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

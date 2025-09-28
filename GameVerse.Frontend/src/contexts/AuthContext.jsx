import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
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
        // Se você tiver um endpoint para pegar o perfil do usuário
        // const response = await authAPI.getProfile();
        // setUser(response.data);
        
        // Por enquanto, vamos usar um usuário mock
        setUser({ 
          id: 1, 
          username: 'UsuarioTeste', 
          email: 'teste@email.com' 
        });
      }
    } catch (error) {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Mock response para teste - substitua pela chamada real depois
      const mockResponse = {
        data: {
          token: 'mock-jwt-token-12345',
          user: {
            id: 1,
            username: credentials.email.split('@')[0],
            email: credentials.email
          }
        }
      };
      
      localStorage.setItem('authToken', mockResponse.data.token);
      setUser(mockResponse.data.user);
      return mockResponse;
      
      // DESCOMENTE QUANDO SUA API ESTIVER PRONTA:
      // const response = await authAPI.login(credentials);
      // localStorage.setItem('authToken', response.data.token);
      // setUser(response.data.user);
      // return response;
      
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Mock response para teste
      const mockResponse = {
        data: {
          message: 'Usuário criado com sucesso!'
        }
      };
      
      return mockResponse;
      
      // DESCOMENTE QUANDO SUA API ESTIVER PRONTA:
      // const response = await authAPI.register(userData);
      // return response;
      
    } catch (error) {
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
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
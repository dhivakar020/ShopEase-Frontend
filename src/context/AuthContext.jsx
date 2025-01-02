// src/context/AuthContext.js
import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem('tokens');
    return savedTokens ? JSON.parse(savedTokens) : null;
  });
  const navigate = useNavigate();

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:8000';
  
  // Add authorization header for all requests if token exists
  axios.interceptors.request.use(
    (config) => {
      if (tokens?.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle token refresh on 401 errors
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response.status === 401 && !originalRequest._retry && tokens?.refresh) {
        originalRequest._retry = true;
        
        try {
          const response = await axios.post('/users/api/token/refresh/', {
            refresh: tokens.refresh
          });
          
          const newTokens = {
            ...tokens,
            access: response.data.access
          };
          
          setTokens(newTokens);
          localStorage.setItem('tokens', JSON.stringify(newTokens));
          
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout user
          setTokens(null);
          localStorage.removeItem('tokens');
          navigate('/login');
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login/', { email, password });
      setTokens(response.data);
      localStorage.setItem('tokens', JSON.stringify(response.data));
      navigate('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await axios.post('/users/signup/', {
        email,
        password,
        role: 'customer'
      });
      setTokens(response.data);
      localStorage.setItem('tokens', JSON.stringify(response.data));
      navigate('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setTokens(null);
    localStorage.removeItem('tokens');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ tokens, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
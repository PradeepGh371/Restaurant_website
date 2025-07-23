import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // If no token, just set loading to false and return
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Verify token with backend
      const response = await axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        throw new Error('Invalid token response');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // Clear token from localStorage if it's invalid
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    // Store token in localStorage when user logs in
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData.user);
  };

  const logout = () => {
    // Clear token from localStorage when user logs out
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
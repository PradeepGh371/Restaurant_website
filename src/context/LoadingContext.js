import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        setPendingRequests((prev) => prev + 1);
        setLoading(true);
        return config;
      },
      (error) => {
        setPendingRequests((prev) => Math.max(0, prev - 1));
        if (pendingRequests <= 1) setLoading(false);
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setPendingRequests((prev) => Math.max(0, prev - 1));
        if (pendingRequests <= 1) setLoading(false);
        return response;
      },
      (error) => {
        setPendingRequests((prev) => Math.max(0, prev - 1));
        if (pendingRequests <= 1) setLoading(false);
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [pendingRequests]);

  // Manual control functions
  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  const value = {
    loading,
    showLoading,
    hideLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingSpinner loading={loading} />
    </LoadingContext.Provider>
  );
};

// Professional loading spinner component
const LoadingSpinner = ({ loading }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="loading-overlay"
        >
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-inner"></div>
            </div>
            <div className="loading-text">Loading...</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
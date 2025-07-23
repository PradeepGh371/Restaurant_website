import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import About from './pages/About';
import Reservation from './pages/Reservation';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import Settings from './pages/Settings';

import './App.css';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';

// Add this import at the top with other imports
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  const location = useLocation();
  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 400, // Reduced from 1000ms to 400ms
      once: true,
      easing: 'ease',
    });
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <LoadingProvider>
          <div className="App font-poppins">
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={<Settings />} />
                <Route path="/customer-dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
              </Routes>
            </main>
            {location.pathname !== '/login' && <Footer />}
          </div>
        </LoadingProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

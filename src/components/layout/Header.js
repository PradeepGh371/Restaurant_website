import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSignInAlt, FaUser, FaSignOutAlt, FaCog, FaChevronDown, FaChartLine } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className={`text-2xl font-playfair font-bold text-black`}>
            GrandVista
            <span className="text-gold"> Hotel</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/about" label={language === 'en' ? 'About' : 'हाम्रो बारेमा'} isScrolled={false} colorClass="text-black" />
          <NavLink to="/menu" label={language === 'en' ? 'Menu' : 'मेनु'} isScrolled={false} colorClass="text-black" />
          <NavLink to="/gallery" label={language === 'en' ? 'Gallery' : 'ग्यालेरी'} isScrolled={false} colorClass="text-black" />
          <NavLink to="/contact" label={language === 'en' ? 'Contact' : 'सम्पर्क'} isScrolled={false} colorClass="text-black" />
          {(!user || user.role !== 'admin') && (
            <Link 
              to="/reservation" 
              className="btn btn-secondary hover:bg-gold hover:text-white transition-all duration-300"
            >
              {language === 'en' ? 'Book Now' : 'बुक गर्नुहोस्'}
            </Link>
          )}
          {user ? (
            <ProfileDropdown 
              user={user} 
              isOpen={isProfileOpen} 
              setIsOpen={setIsProfileOpen}
              handleLogout={handleLogout}
              isScrolled={false}
            />
          ) : (
            <Link
              to="/login"
              className="btn-login-navbar flex items-center justify-center ml-2 px-4 py-2 text-base font-semibold border border-gold text-navy bg-white hover:bg-gold hover:text-navy transition-all duration-200 shadow-sm"
              style={{ borderRadius: '9999px', minWidth: 44, height: 40 }}
            >
              <FaSignInAlt className="text-lg" />
              <span className="ml-2 hidden sm:inline">Login</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FaTimes className={isScrolled ? 'text-navy' : 'text-white'} />
          ) : (
            <FaBars className={isScrolled ? 'text-navy' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {/* Removed Home link from mobile nav */}
          <MobileNavLink to="/about" label="About" />
          <MobileNavLink to="/menu" label="Menu" />
          <MobileNavLink to="/gallery" label="Gallery" />
          <MobileNavLink to="/contact" label="Contact" />
          <Link 
            to="/reservation" 
            className="btn btn-secondary w-full text-center"
          >
            Book Now
          </Link>
          {user ? (
            <div className="border-t border-gray-200 pt-4">
              <div className="px-2 py-2 border-b border-gray-100 mb-2">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <button
                onClick={() => {
                  navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm text-gray-700 hover:text-gold flex items-center space-x-2"
              >
                <FaCog className="text-sm" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-sm text-red-600 hover:text-red-700 flex items-center space-x-2"
              >
                <FaSignOutAlt className="text-sm" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary w-full text-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, label, isScrolled, colorClass }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`
        font-medium transition-all duration-300 relative
        ${colorClass}
        ${isActive ? 'font-semibold' : 'hover:text-gold'}
      `}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-[-5px] left-0 w-full h-[2px] bg-gold" />
      )}
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`
        py-2 font-medium text-navy transition-all duration-300
        ${isActive ? 'font-semibold text-gold' : 'hover:text-gold'}
      `}
    >
      {label}
    </Link>
  );
};

// --- Professional Profile Dropdown ---
const ProfileDropdown = ({ user, isOpen, setIsOpen, handleLogout, isScrolled }) => {
  const navigate = useNavigate();
  return (
    <div className="relative profile-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border-none shadow-md font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold bg-navy text-white hover:bg-gold hover:text-navy`}
        style={{ minWidth: 44, height: 44 }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FaUser className="text-lg" />
        <span className="font-medium">{user?.name || 'User'}</span>
        <FaChevronDown className={`text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 dropdown-menu animate-fadeIn">
          <button
            onClick={() => { navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-navy hover:bg-gray-50 font-semibold rounded-t-xl"
          >
            <FaChartLine className="text-gold" />
            Dashboard
          </button>
          <button
            onClick={() => { navigate('/settings'); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-navy hover:bg-gray-50 font-semibold"
          >
            <FaCog className="text-gold" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold rounded-b-xl"
          >
            <FaSignOutAlt className="text-red-400" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
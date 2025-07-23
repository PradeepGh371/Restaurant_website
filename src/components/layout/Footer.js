import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaTripadvisor, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const Footer = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
    // Here you would typically send the email to your newsletter service
    alert('Thank you for subscribing to our newsletter!');
    reset();
  };

  return (
    <footer className="bg-navy text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-6">GrandVista <span className="text-gold">Hotel</span></h3>
            <p className="text-gray-300 mb-6">
              Experience luxury and comfort at its finest in the heart of the city. Our elegant accommodations and exceptional service ensure a memorable stay.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<FaFacebookF />} href="https://facebook.com" />
              <SocialIcon icon={<FaTwitter />} href="https://twitter.com" />
              <SocialIcon icon={<FaInstagram />} href="https://instagram.com" />
              <SocialIcon icon={<FaTripadvisor />} href="https://tripadvisor.com" />
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <ContactItem 
                icon={<FaMapMarkerAlt />}
                text="123 Luxury Avenue, Downtown, City, 10001"
              />
              <ContactItem 
                icon={<FaPhone />}
                text="+1 (555) 123-4567"
                href="tel:+15551234567"
              />
              <ContactItem 
                icon={<FaEnvelope />}
                text="info@grandvistahotel.com"
                href="mailto:info@grandvistahotel.com"
              />
              <ContactItem 
                icon={<FaClock />}
                text="Reception: Open 24/7"
              />
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/about" text="About Us" />
              <FooterLink to="/menu" text="Restaurant Menu" />
              <FooterLink to="/gallery" text="Gallery" />
              <FooterLink to="/contact" text="Contact" />
              <FooterLink to="/reservation" text="Book Now" />
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to receive special offers and updates.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <input 
                  type="email" 
                  placeholder="Your Email Address"
                  className={`w-full p-3 bg-navy-light border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <button 
                type="submit" 
                className="w-full bg-gold text-navy font-semibold py-3 px-4 rounded-md hover:bg-white transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Opening Hours */}
        <div className="border-t border-gray-800 pt-8 pb-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-center">Opening Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-center">
            <OpeningHoursItem title="Restaurant" hours={['Breakfast: 6:30 AM - 10:30 AM', 'Lunch: 12:00 PM - 2:30 PM', 'Dinner: 6:00 PM - 10:00 PM']} />
            <OpeningHoursItem title="Spa & Wellness" hours={['Daily: 9:00 AM - 9:00 PM']} />
            <OpeningHoursItem title="Fitness Center" hours={['Daily: 6:00 AM - 10:00 PM']} />
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} GrandVista Hotel. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Social Icon Component
const SocialIcon = ({ icon, href }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-gold hover:text-navy transition-colors duration-300"
    >
      {icon}
    </a>
  );
};

// Contact Item Component
const ContactItem = ({ icon, text, href }) => {
  return (
    <li className="flex items-start">
      <div className="text-gold mr-3 mt-1">
        {icon}
      </div>
      {href ? (
        <a href={href} className="text-gray-300 hover:text-gold transition-colors duration-300">
          {text}
        </a>
      ) : (
        <span className="text-gray-300">{text}</span>
      )}
    </li>
  );
};

// Footer Link Component
const FooterLink = ({ to, text }) => {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-300 hover:text-gold transition-colors duration-300"
      >
        {text}
      </Link>
    </li>
  );
};

// Opening Hours Component
const OpeningHoursItem = ({ title, hours }) => {
  return (
    <div>
      <h4 className="text-gold font-semibold mb-2">{title}</h4>
      <ul className="text-gray-300 text-sm">
        {hours.map((hour, index) => (
          <li key={index} className="mb-1">{hour}</li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
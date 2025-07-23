import React from 'react';
import { useForm } from 'react-hook-form';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
    // Here you would typically send the form data to your backend
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 bg-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Contact GrandVista Hotel" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 
            className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6"
            data-aos="fade-up"
          >
            Contact <span className="text-gold">Us</span>
          </h1>
          <p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            We're here to answer any questions you may have about our hotel
          </p>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Information */}
            <div className="lg:w-1/3" data-aos="fade-right">
              <h2 className="section-title text-left">Get In Touch</h2>
              <p className="text-gray-700 mb-8">
                Have questions about our services, rooms, or special requests? Contact us using the information below or fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <ContactInfo 
                  icon={<FaMapMarkerAlt />}
                  title="Address"
                  detail="123 Luxury Avenue, Downtown, City, 10001"
                />
                
                <ContactInfo 
                  icon={<FaPhone />}
                  title="Phone"
                  detail="+1 (555) 123-4567"
                />
                
                <ContactInfo 
                  icon={<FaEnvelope />}
                  title="Email"
                  detail="info@grandvistahotel.com"
                />
                
                <ContactInfo 
                  icon={<FaClock />}
                  title="Reception Hours"
                  detail="Open 24 hours, 7 days a week"
                />
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:w-2/3" data-aos="fade-left">
              <div className="bg-gray-100 p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-playfair font-bold text-navy mb-6">Send Us a Message</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        id="name"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="John Doe"
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="john@example.com"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      id="subject"
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Reservation Inquiry"
                      {...register('subject', { required: 'Subject is required' })}
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                    <textarea 
                      id="message"
                      rows="5"
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Your message here..."
                      {...register('message', { required: 'Message is required' })}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full md:w-auto"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section bg-gray-100 pt-0">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mx-auto after:left-1/2 after:-translate-x-1/2 mb-12" data-aos="fade-up">Find Us</h2>
          
          <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md" data-aos="zoom-in">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215151464712!2d-73.98784492426385!3d40.75797623440235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1696359089530!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="GrandVista Hotel Location"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

// Contact Info Component
const ContactInfo = ({ icon, title, detail }) => {
  return (
    <div className="flex items-start">
      <div className="text-gold text-xl mr-4 mt-1">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-navy">{title}</h4>
        <p className="text-gray-700">{detail}</p>
      </div>
    </div>
  );
};

export default Contact;
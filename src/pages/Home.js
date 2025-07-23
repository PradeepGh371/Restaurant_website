import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaBed, FaSwimmingPool, FaWifi, FaCocktail, FaCar } from 'react-icons/fa';
import { formatNepaliCurrency } from '../utils/nepaliFormat';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="GrandVista Hotel" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-6"
            data-aos="fade-up"
          >
            Elegant Stay, <span className="text-gold">Modern Experience</span>
          </h1>
          <p 
            className="text-xl text-white mb-8 max-w-2xl mx-auto"
            data-aos="fade-up"
          >
            Experience luxury and comfort at its finest in the heart of the city
          </p>
          <div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            data-aos="fade-up"
          >
            <Link to="/reservation" className="btn btn-secondary hover:bg-white hover:text-gold transition-all duration-300">
              Book Now
            </Link>
            <Link to="/about" className="btn btn-outline text-white border-white hover:bg-white hover:text-navy transition-all duration-300">
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2" data-aos="fade-right">
              <h2 className="section-title text-left">Welcome to GrandVista Hotel</h2>
              <p className="text-gray-700 mb-6">
                Nestled in the heart of the city, GrandVista Hotel offers an unparalleled blend of luxury, comfort, and exceptional service. Our elegant accommodations, world-class amenities, and dedicated staff ensure a memorable stay for both business and leisure travelers.
              </p>
              <p className="text-gray-700 mb-6">
                Whether you're joining us for a short business trip or an extended family vacation, our goal is to make your stay as comfortable and enjoyable as possible. Experience the perfect balance of modern luxury and warm hospitality at GrandVista Hotel.
              </p>
              <Link to="/about" className="btn btn-primary">
                Learn More About Us
              </Link>
            </div>
            <div className="md:w-1/2" data-aos="fade-left">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Hotel Interior" 
                  className="rounded-lg shadow-xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -left-6 bg-gold text-navy p-4 rounded-lg shadow-lg">
                  <p className="font-playfair font-bold text-xl">15+ Years</p>
                  <p>of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mx-auto after:left-1/2 after:-translate-x-1/2" data-aos="fade-up">Our Amenities & Services</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12" data-aos="fade-up">
            Indulge in our wide range of amenities designed to make your stay comfortable, convenient, and memorable.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaUtensils className="text-gold text-4xl mb-4" />}
              title="Fine Dining"
              description="Experience culinary excellence with our gourmet restaurant offering local and international cuisine."
            />
            <FeatureCard 
              icon={<FaBed className="text-gold text-4xl mb-4" />}
              title="Luxury Rooms"
              description="Relax in our spacious, elegantly designed rooms featuring premium bedding and modern amenities."
            />
            <FeatureCard 
              icon={<FaSwimmingPool className="text-gold text-4xl mb-4" />}
              title="Swimming Pool"
              description="Take a refreshing dip in our temperature-controlled pool with stunning panoramic views."
            />
            <FeatureCard 
              icon={<FaWifi className="text-gold text-4xl mb-4" />}
              title="High-Speed WiFi"
              description="Stay connected with complimentary high-speed internet access throughout the hotel."
            />
            <FeatureCard 
              icon={<FaCocktail className="text-gold text-4xl mb-4" />}
              title="Bar & Lounge"
              description="Unwind with your favorite drinks at our stylish bar offering a wide selection of beverages."
            />
            <FeatureCard 
              icon={<FaCar className="text-gold text-4xl mb-4" />}
              title="Free Parking"
              description="Enjoy the convenience of complimentary parking for all our hotel guests."
            />
          </div>
        </div>
      </section>

      {/* Room Showcase */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mx-auto after:left-1/2 after:-translate-x-1/2" data-aos="fade-up">Our Rooms & Suites</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12" data-aos="fade-up">Choose from our selection of elegantly designed rooms and suites, each offering comfort and luxury.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoomCard 
              image="https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              title="Deluxe Room"
              price={199}
              features={['King Size Bed', 'City View', 'Free WiFi', 'Breakfast Included']}
            />
            <RoomCard 
              image="https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
              title="Executive Suite"
              price={299}
              features={['King Size Bed', 'Ocean View', 'Jacuzzi', 'Lounge Access']}
              featured={true}
            />
            <RoomCard 
              image="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
              title="Family Suite"
              price={349}
              features={['2 Bedrooms', 'Garden View', 'Kitchenette', 'Kids Area']}
            />
          </div>
          
          <div className="mt-12" data-aos="fade-up">
            <Link to="/reservation" className="btn btn-primary">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mx-auto after:left-1/2 after:-translate-x-1/2" data-aos="fade-up">What Our Guests Say</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12" data-aos="fade-up">
            Read what our satisfied guests have to say about their experience at GrandVista Hotel.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah Johnson"
              location="New York, USA"
              rating={5}
              text="The service was impeccable, and the room exceeded our expectations. The staff went above and beyond to make our anniversary special. We'll definitely be back!"
              image="https://randomuser.me/api/portraits/women/44.jpg"
            />
            <TestimonialCard 
              name="David Chen"
              location="Toronto, Canada"
              rating={5}
              text="As a business traveler, I appreciate the efficient service, reliable WiFi, and comfortable workspace. The breakfast was outstanding, and the location is perfect for my meetings."
              image="https://randomuser.me/api/portraits/men/32.jpg"
            />
            <TestimonialCard 
              name="Emma Rodriguez"
              location="London, UK"
              rating={4}
              text="We had a wonderful family vacation at GrandVista. The kids loved the pool, and we enjoyed the restaurant's diverse menu. The rooms were spacious and beautifully designed."
              image="https://randomuser.me/api/portraits/women/68.jpg"
            />
          </div>
          
          <div className="mt-12" data-aos="fade-up">
            <Link to="/reviews" className="btn btn-outline">
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Hotel Interior" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 
            className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6"
            data-aos="fade-up"
          >
            Experience Luxury Like Never Before
          </h2>
          <p 
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Book your stay today and enjoy exclusive offers and amenities
          </p>
          <div 
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link to="/reservation" className="btn btn-secondary hover:bg-white hover:text-gold transition-all duration-300">
              Book Your Stay Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {icon}
      <h3 className="text-xl font-semibold mb-3 text-navy">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Room Card Component
const RoomCard = ({ image, title, price, features, featured = false, delay }) => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ${featured ? 'ring-2 ring-gold' : ''}`}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-64 object-cover" />
        {featured && (
          <div className="absolute top-4 right-4 bg-gold text-navy text-sm font-bold py-1 px-3 rounded-full">
            Popular Choice
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-navy">{title}</h3>
        <p className="text-gold font-bold text-xl mb-4">{formatNepaliCurrency(price)}</p>
        <ul className="mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="text-gray-600 flex items-center">
              <svg className="w-4 h-4 text-gold mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        {isAdmin ? (
          <button className="btn btn-primary w-full text-center opacity-50 cursor-not-allowed" disabled>
            Book Now (Admins cannot book)
          </button>
        ) : (
        <Link to="/reservation" className="btn btn-primary w-full text-center">
          Book Now
        </Link>
        )}
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, location, rating, text, image, delay }) => {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className="flex items-center mb-4">
        <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h4 className="font-semibold text-navy">{name}</h4>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'text-gold' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
      <p className="text-gray-600 italic mb-4">"{text}"</p>
    </div>
  );
};

export default Home;
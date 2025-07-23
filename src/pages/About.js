import React from 'react';
import { FaCheck, FaUsers, FaHotel, FaSmile } from 'react-icons/fa';
import SocialSidebar from '../components/common/SocialSidebar';

const About = () => {
  return (
    <>
      <SocialSidebar />
      {/* Hero Section */}
      <section className="relative py-32 bg-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80" 
            alt="About GrandVista Hotel" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 
            className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6"
            data-aos="fade-up"
          >
            About <span className="text-gold">GrandVista</span>
          </h1>
          <p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
          >
            Discover our story, mission, and the team behind our exceptional hospitality
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2" data-aos="fade-right">
              <h2 className="section-title text-left">Our Story</h2>
              <p className="text-gray-700 mb-6">
                Founded in 2005, GrandVista Hotel began with a vision to create a luxury hospitality experience that combines elegant accommodations with exceptional service. What started as a boutique hotel with just 25 rooms has grown into a renowned establishment with over 150 rooms and suites, multiple dining venues, and world-class amenities.
              </p>
              <p className="text-gray-700 mb-6">
                Over the years, we've maintained our commitment to personalized service while expanding our offerings to meet the evolving needs of our guests. Our dedication to excellence has earned us numerous accolades and the loyalty of guests who return year after year.
              </p>
              <p className="text-gray-700">
                Today, GrandVista Hotel stands as a symbol of luxury and comfort, welcoming guests from around the world and providing them with memorable experiences that go beyond ordinary hospitality.
              </p>
            </div>
            <div className="md:w-1/2" data-aos="fade-left">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Hotel History" 
                  className="rounded-lg shadow-md w-full h-auto object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
                  alt="Hotel Lobby" 
                  className="rounded-lg shadow-md w-full h-auto object-cover mt-8"
                />
                <img 
                  src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Hotel Restaurant" 
                  className="rounded-lg shadow-md w-full h-auto object-cover mt-8"
                />
                <img 
                  src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Hotel Pool" 
                  className="rounded-lg shadow-md w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <h2 className="section-title mx-auto after:left-1/2 after:-translate-x-1/2">Our Mission & Values</h2>
            <p className="text-gray-700">
              At GrandVista Hotel, we're guided by a clear mission and a set of core values that shape everything we do.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md" data-aos="fade-right">
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Our Mission</h3>
              <p className="text-gray-700 mb-6">
                To provide exceptional hospitality experiences that exceed expectations, create lasting memories, and inspire guests to return. We strive to be the preferred destination for travelers seeking luxury, comfort, and personalized service.
              </p>
              <p className="text-gray-700">
                We are committed to sustainable practices, community engagement, and creating a positive impact on the lives of our guests, team members, and the environment.
              </p>
            </div>
            
            <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md" data-aos="fade-left">
              <h3 className="text-2xl font-playfair font-bold text-navy mb-4">Our Core Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-gold mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-navy">Excellence</h4>
                    <p className="text-gray-700">We pursue excellence in every detail, from the cleanliness of our rooms to the quality of our service.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-gold mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-navy">Personalization</h4>
                    <p className="text-gray-700">We recognize each guest as an individual with unique needs and preferences.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-gold mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-navy">Integrity</h4>
                    <p className="text-gray-700">We operate with honesty, transparency, and ethical standards in all our interactions.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-gold mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-navy">Innovation</h4>
                    <p className="text-gray-700">We continuously seek new ways to enhance the guest experience and improve our services.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="text-gold text-4xl mb-2">
                <FaHotel />
              </div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-xl">Luxury Rooms & Suites</div>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="text-gold text-4xl mb-2">
                <FaUsers />
              </div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-xl">Professional Staff</div>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="300">
              <div className="text-gold text-4xl mb-2">
                <FaSmile />
              </div>
              <div className="text-4xl font-bold mb-2">15k+</div>
              <div className="text-xl">Happy Guests</div>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="400">
              <div className="text-gold text-4xl mb-2">
                <svg className="w-10 h-10 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-xl">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title mx-auto after:left-1/2 after:-translate-x-1/2" data-aos="fade-up">Meet Our Team</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12" data-aos="fade-up" data-aos-delay="100">
            Our dedicated team of professionals is committed to making your stay exceptional.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamMember 
              image="https://randomuser.me/api/portraits/men/32.jpg"
              name="Michael Thompson"
              position="General Manager"
              bio="With over 20 years in luxury hospitality, Michael ensures every aspect of GrandVista meets the highest standards."
              delay={100}
            />
            <TeamMember 
              image="https://randomuser.me/api/portraits/women/44.jpg"
              name="Sophia Rodriguez"
              position="Executive Chef"
              bio="Sophia brings her international culinary expertise to create unforgettable dining experiences for our guests."
              delay={200}
            />
            <TeamMember 
              image="https://randomuser.me/api/portraits/men/68.jpg"
              name="David Chen"
              position="Concierge Manager"
              bio="David's extensive knowledge of the city and attention to detail ensures guests receive personalized recommendations."
              delay={300}
            />
            <TeamMember 
              image="https://randomuser.me/api/portraits/women/65.jpg"
              name="Emily Johnson"
              position="Guest Relations Director"
              bio="Emily leads our front-of-house team with a passion for creating memorable guest experiences."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2" data-aos="fade-up">Our Journey</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12 text-center" data-aos="fade-up">From our humble beginnings to becoming a leading luxury hotel.</p>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gold"></div>
            
            <div className="space-y-12">
              <TimelineItem 
                year="2005"
                title="The Beginning"
                description="GrandVista Hotel was founded with just 25 rooms, focusing on personalized service and attention to detail."
                isLeft={true}
                delay={100}
              />
              <TimelineItem 
                year="2010"
                title="First Expansion"
                description="We expanded to 75 rooms and added our signature restaurant, receiving our first industry award."
                isLeft={false}
                delay={200}
              />
              <TimelineItem 
                year="2015"
                title="Luxury Redefined"
                description="A major renovation introduced our luxury suites, spa facilities, and conference center."
                isLeft={true}
                delay={300}
              />
              <TimelineItem 
                year="2020"
                title="Digital Transformation"
                description="We embraced technology with a new booking system, mobile check-in, and smart room features."
                isLeft={false}
                delay={400}
              />
              <TimelineItem 
                year="Today"
                title="Continuing Excellence"
                description="Now with over 150 rooms and suites, we continue to evolve while maintaining our commitment to exceptional hospitality."
                isLeft={true}
                delay={500}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Team Member Component
const TeamMember = ({ image, name, position, bio, delay }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <img src={image} alt={name} className="w-full h-64 object-cover object-center" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-navy mb-1">{name}</h3>
        <p className="text-gold font-medium mb-3">{position}</p>
        <p className="text-gray-600">{bio}</p>
      </div>
    </div>
  );
};

// Timeline Item Component
const TimelineItem = ({ year, title, description, isLeft, delay }) => {
  return (
    <div 
      className={`flex items-center justify-between relative ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
      data-aos={isLeft ? 'fade-right' : 'fade-left'}
      data-aos-delay={delay}
    >
      {/* Content */}
      <div className={`w-5/12 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
        <h3 className="text-xl font-bold text-navy">{title}</h3>
        <p className="text-gray-600 mb-2">{description}</p>
      </div>
      
      {/* Year Bubble */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-lg z-10">
        {year}
      </div>
      
      {/* Empty Space */}
      <div className="w-5/12"></div>
    </div>
  );
};

export default About;
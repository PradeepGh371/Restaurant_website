import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'rooms', name: 'Rooms' },
    { id: 'dining', name: 'Dining' },
    { id: 'amenities', name: 'Amenities' },
    { id: 'events', name: 'Events' },
  ];
  
  const galleryImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Luxury Suite',
      category: 'rooms',
      title: 'Luxury Suite'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80',
      alt: 'Executive Room',
      category: 'rooms',
      title: 'Executive Room'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Fine Dining Restaurant',
      category: 'dining',
      title: 'Fine Dining Restaurant'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Gourmet Cuisine',
      category: 'dining',
      title: 'Gourmet Cuisine'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Infinity Pool',
      category: 'amenities',
      title: 'Infinity Pool'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Spa Treatment',
      category: 'amenities',
      title: 'Spa Treatment'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2098&q=80',
      alt: 'Wedding Reception',
      category: 'events',
      title: 'Wedding Reception'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Business Conference',
      category: 'events',
      title: 'Business Conference'
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Hotel Exterior',
      category: 'amenities',
      title: 'Hotel Exterior'
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1621275471769-e6aa344546d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
      alt: 'Penthouse Suite',
      category: 'rooms',
      title: 'Penthouse Suite'
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Cocktail Bar',
      category: 'dining',
      title: 'Cocktail Bar'
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: 'Gala Dinner',
      category: 'events',
      title: 'Gala Dinner'
    },
  ];
  
  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === activeCategory);

  const openLightbox = (image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 bg-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="GrandVista Gallery" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 
            className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6"
            data-aos="fade-up"
          >
            Our <span className="text-gold">Gallery</span>
          </h1>
          <p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Explore the beauty and elegance of GrandVista Hotel through our photo gallery
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center mb-12" data-aos="fade-up">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-6 py-3 mx-2 mb-2 rounded-full transition-all duration-300 ${activeCategory === category.id ? 'bg-gold text-navy font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group"
                  onClick={() => openLightbox(image)}
                  data-aos="fade-up"
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                      <p className="text-gold capitalize">{image.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              className="absolute top-4 right-4 text-white text-2xl z-10 hover:text-gold transition-colors"
              onClick={closeLightbox}
            >
              ×
            </button>
            <img 
              src={lightboxImage.src} 
              alt={lightboxImage.alt} 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="text-center mt-4">
              <h3 className="text-white font-semibold text-xl">{lightboxImage.title}</h3>
              <p className="text-gold capitalize">{lightboxImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
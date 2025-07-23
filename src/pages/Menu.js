import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the missing components
import MenuItem from '../components/menu/MenuItem';
import MenuCategory from '../components/menu/MenuCategory';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('breakfast');
  
  const categories = [
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-32 bg-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="GrandVista Restaurant" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 
            className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6"
            data-aos="fade-up"
          >
            Our <span className="text-gold">Menu</span>
          </h1>
          <p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
          >
            Indulge in a culinary journey with our exquisite selection of dishes and beverages
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          {/* Category Tabs */}
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
          
          {/* Menu Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="wait">
              {activeCategory === 'breakfast' && (
                <>
                  <MenuCategory title="Breakfast" subtitle="Served from 6:30 AM to 10:30 AM" />
                  <div></div> {/* Empty div for alignment */}
                  
                  <MenuItem 
                    name="Continental Breakfast"
                    description="Selection of freshly baked pastries, bread, jam, butter, yogurt, fresh fruits, and your choice of coffee or tea."
                    price={18}
                    image="https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    vegetarian={true}
                    delay={100}
                  />
                  <MenuItem 
                    name="American Breakfast"
                    description="Two eggs any style, bacon or sausage, hash browns, toast, and your choice of coffee, tea, or juice."
                    price={22}
                    image="https://images.unsplash.com/photo-1529564879024-c54e7c2dd0e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    delay={200}
                  />
                  <MenuItem 
                    name="Eggs Benedict"
                    description="Poached eggs on English muffin with Canadian bacon, topped with hollandaise sauce, served with roasted potatoes."
                    price={24}
                    image="https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1336&q=80"
                    delay={300}
                  />
                  <MenuItem 
                    name="Avocado Toast"
                    description="Multigrain toast topped with smashed avocado, cherry tomatoes, microgreens, and a poached egg."
                    price={20}
                    image="https://images.unsplash.com/photo-1603046891744-76e6300f82ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                    vegetarian={true}
                    delay={400}
                  />
                  <MenuItem 
                    name="Belgian Waffles"
                    description="Crispy Belgian waffles served with maple syrup, fresh berries, and whipped cream."
                    price={19}
                    image="https://images.unsplash.com/photo-1562376552-0d160a2f35b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80"
                    vegetarian={true}
                    delay={500}
                  />
                  <MenuItem 
                    name="Smoked Salmon Bagel"
                    description="Toasted bagel with cream cheese, smoked salmon, capers, red onion, and dill."
                    price={23}
                    image="https://images.unsplash.com/photo-1651156952048-8acb8fa8dd2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                    delay={600}
                  />
                </>
              )}
              
              {activeCategory === 'lunch' && (
                <>
                  <MenuCategory title="Lunch" subtitle="Served from 11:30 AM to 2:30 PM" />
                  <div></div> {/* Empty div for alignment */}
                  
                  <MenuItem 
                    name="Caesar Salad"
                    description="Crisp romaine lettuce, garlic croutons, parmesan cheese, and our house-made Caesar dressing. Add grilled chicken or shrimp for an additional charge."
                    price={16}
                    image="https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    vegetarian={true}
                    delay={100}
                  />
                  <MenuItem 
                    name="Club Sandwich"
                    description="Triple-decker sandwich with grilled chicken, bacon, lettuce, tomato, and mayonnaise on toasted bread, served with fries."
                    price={19}
                    image="https://images.unsplash.com/photo-1567234669003-dce7a7a88821?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                    delay={200}
                  />
                  <MenuItem 
                    name="Grilled Salmon"
                    description="Fresh Atlantic salmon fillet, grilled to perfection, served with seasonal vegetables and lemon herb sauce."
                    price={26}
                    image="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    delay={300}
                  />
                  <MenuItem 
                    name="Vegetable Pasta"
                    description="Penne pasta with sautéed seasonal vegetables, cherry tomatoes, and basil pesto, topped with parmesan cheese."
                    price={18}
                    image="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    vegetarian={true}
                    delay={400}
                  />
                  <MenuItem 
                    name="Gourmet Burger"
                    description="Angus beef patty with cheddar cheese, caramelized onions, lettuce, tomato, and special sauce on a brioche bun, served with fries."
                    price={22}
                    image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1299&q=80"
                    delay={500}
                  />
                  <MenuItem 
                    name="Quinoa Bowl"
                    description="Nutritious quinoa bowl with roasted vegetables, avocado, chickpeas, and tahini dressing."
                    price={17}
                    image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80"
                    vegetarian={true}
                    delay={600}
                  />
                </>
              )}
              
              {activeCategory === 'dinner' && (
                <>
                  <MenuCategory title="Dinner" subtitle="Served from 6:00 PM to 10:00 PM" />
                  <div></div> {/* Empty div for alignment */}
                  
                  <MenuItem 
                    name="Filet Mignon"
                    description="8oz prime beef tenderloin, grilled to your preference, served with truffle mashed potatoes and seasonal vegetables."
                    price={42}
                    image="https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    delay={100}
                  />
                  <MenuItem 
                    name="Lobster Risotto"
                    description="Creamy Arborio rice with butter-poached lobster, finished with parmesan cheese and fresh herbs."
                    price={38}
                    image="https://images.unsplash.com/photo-1633436375153-d7045cb93e38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
                    delay={200}
                  />
                  <MenuItem 
                    name="Rack of Lamb"
                    description="Herb-crusted rack of lamb with rosemary jus, served with roasted potatoes and glazed carrots."
                    price={40}
                    image="https://images.unsplash.com/photo-1514516345957-556ca7c90a34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    delay={300}
                  />
                </>
              )}
              
              {activeCategory === 'drinks' && (
                <>
                  <MenuCategory title="Drinks" subtitle="Served from 6:00 PM to 10:00 PM" />
                  <div></div> {/* Empty div for alignment */}
                  
                  <MenuItem 
                    name="Cappuccino"
                    description="Creamy, frothy, and aromatic Italian coffee."
                    price={25}
                    image="https://images.unsplash.com/photo-1514516345957-556ca7c90a34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    delay={300}
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
};

export default Menu;
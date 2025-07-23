import React from 'react';
import { motion } from 'framer-motion';

const MenuCategory = ({ title, subtitle }) => {
  return (
    <motion.div 
      className="col-span-2 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-3xl font-playfair text-navy mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600 italic">{subtitle}</p>}
      <div className="w-20 h-1 bg-gold mt-2"></div>
    </motion.div>
  );
};

export default MenuCategory;
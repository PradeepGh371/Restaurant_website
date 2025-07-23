import React from 'react';
import { motion } from 'framer-motion';
import { formatNepaliCurrency } from '../../utils/nepaliFormat';

const MenuItem = ({ name, description, price, image, vegetarian, delay = 0 }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
    >
      {image && (
        <div className="md:w-1/3 h-48 md:h-auto">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 md:w-2/3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-navy">{name}</h3>
          <span className="text-xl font-semibold text-gold">{formatNepaliCurrency(price)}</span>
        </div>
        {vegetarian && (
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">Vegetarian</span>
        )}
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default MenuItem;
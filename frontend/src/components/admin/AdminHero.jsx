
import React from 'react';
import { motion } from 'framer-motion';

const AdminHero = ({ title, subtitle, children }) => {
  return (
    <section className="relative pt-24 pb-16 bg-gradient-to-br from-green-900 via-blue-800 to-teal-800 overflow-hidden">
      <div className="absolute inset-0 tech-pattern opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight" dangerouslySetInnerHTML={{ __html: title }}></h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default AdminHero;

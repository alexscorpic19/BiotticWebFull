import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const phoneNumber = '573174133379';
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300 }}
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8" />
    </motion.a>
  );
};

export default WhatsAppButton;

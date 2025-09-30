import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Servicios - Biottic | Soluciones Tecnológicas</title>
        <meta name="description" content="Descubre la gama de servicios que Biottic ofrece: automatización, monitoreo, desarrollo de software y más." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-green-900 via-blue-800 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20"></div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Servicios</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Descubre cómo podemos ayudarte con nuestras soluciones tecnológicas
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
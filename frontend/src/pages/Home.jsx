
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
  ArrowRight,
  Zap,
  Droplets,
  Monitor,
  Bot,
  Shield,
  Users,
  Award,
  ChevronRight,
  Play
} from 'lucide-react';
import { Button } from '../components/ui/button';
import VideoModal from '../components/VideoModal';

const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const features = [
    {
      icon: Droplets,
      title: 'Sistemas de Riego Inteligente',
      description: 'Automatización completa para optimizar el uso del agua y mejorar la productividad agrícola.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Monitor,
      title: 'Monitoreo Ambiental',
      description: 'Sensores avanzados para el control en tiempo real de variables ambientales críticas.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Bot,
      title: 'Biobot Académico',
      description: 'Módulos educativos para competencias de robótica y desarrollo de habilidades STEM.',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const stats = [
    { number: '500+', label: 'Proyectos Completados' },
    { number: '50+', label: 'Clientes Satisfechos' },
    { number: '5+', label: 'Años de Experiencia' },
    { number: '24/7', label: 'Soporte Técnico' }
  ];

  const testimonials = [
    {
      name: 'Carlos Mendoza',
      role: 'Ingeniero Agrónomo',
      content: 'Los sistemas de riego de Biottic transformaron completamente nuestra producción. Ahorro del 40% en consumo de agua.',
      avatar: '👨‍🌾'
    },
    {
      name: 'Ana García',
      role: 'Directora de Laboratorio',
      content: 'El monitoreo ambiental nos permite mantener condiciones óptimas 24/7. Tecnología confiable y precisa.',
      avatar: '👩‍🔬'
    },
    {
      name: 'Prof. Luis Torres',
      role: 'Universidad Nacional',
      content: 'Biobot es una herramienta excepcional para enseñar robótica. Los estudiantes aprenden de manera práctica y divertida.',
      avatar: '👨‍🏫'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Biottic - Tecnología e Innovación para el Futuro</title>
        <meta name="description" content="Biottic desarrolla dispositivos electrónicos y automatizaciones innovadoras. Sistemas de riego automatizados, monitoreo ambiental y dispositivos académicos." />
      </Helmet>

      <VideoModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        videoUrl="https://www.youtube.com/embed/RjxVU1fIh5I?autoplay=1"
        //https://www.youtube.com/watch?v=RjxVU1fIh5I
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
        <div className="absolute inset-0 tech-pattern opacity-20"></div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Innovación Tecnológica Colombiana
                </motion.div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Transformamos Ideas en
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
                    Tecnología Real
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  Desarrollamos dispositivos electrónicos inteligentes y sistemas de automatización 
                  que revolucionan la agricultura, educación y monitoreo ambiental.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/products">
                  <Button variant="custom-white" size="lg" className="px-8 py-4 text-lg">
                    Explorar Productos
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                
                <Button 
                  variant="hero-outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg"
                  onClick={openModal}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Ver Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float hidden sm:block"> {/* Hidden on xs, block from sm */}
          <div className="w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float hidden sm:block" style={{ animationDelay: '2s' }}> {/* Hidden on xs, block from sm */}
          <div className="w-16 h-16 bg-emerald-400/20 rounded-full backdrop-blur-sm"></div>
        </div>
        <div className="absolute top-1/2 right-20 animate-float hidden sm:block" style={{ animationDelay: '4s' }}> {/* Hidden on xs, block from sm */}
          <div className="w-12 h-12 bg-cyan-400/20 rounded-full backdrop-blur-sm"></div>
        </div>
      </section>

  {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Nuestras <span className="text-gradient">Soluciones</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Tecnología de vanguardia diseñada para resolver desafíos reales en diferentes sectores
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="group relative"
                >
                  <div className="card-hover bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 h-full">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    <Link 
                      to="/products" 
                      className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors"
                    >
                      Conocer más
                      <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

  {/* Stats Section */}
  <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-blue-100 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>

  {/* About Preview Section */}
  <section className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              ¿Por qué elegir <span className="text-gradient">Biottic</span>?
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Somos una empresa colombiana especializada en el desarrollo de tecnología IoT 
              y automatización. Nuestro compromiso es crear soluciones que generen impacto 
              real en la productividad y sostenibilidad.
            </p>

            <div className="space-y-4 mb-8">
              {[ // Changed to use the correct icons and text
                { icon: Shield, text: 'Tecnología confiable y probada' },
                { icon: Users, text: 'Soporte técnico especializado' },
                { icon: Award, text: 'Innovación reconocida en el sector' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <Link to="/about">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Conocer más sobre nosotros
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              <img loading="lazy" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                alt="Equipo de Biottic trabajando en laboratorio"
               src="https://images.unsplash.com/photo-1581094271901-8022df4466f9" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"></div>
          </motion.div>
        </div>
    </div>
    </div>
    </section>

    {/* Testimonials Section */}
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Lo que dicen nuestros <span className="text-gradient">clientes</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              La confianza de nuestros clientes es nuestro mayor logro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 card-hover"
              >
                <div className="text-6xl mb-4">{testimonial.avatar}</div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 bg-gradient-to-r from-green-900 via-blue-800 to-teal-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para innovar con nosotros?
            </h2>
            
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Descubre cómo nuestras soluciones tecnológicas pueden transformar tu proyecto.
              Contáctanos para una consulta personalizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="custom-white" size="lg" className="px-8 py-4 text-lg">
                  Contactar ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link to="/products">
                <Button 
                  variant="hero-outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg"
                >
                  Ver productos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </>
);
};

export default Home;

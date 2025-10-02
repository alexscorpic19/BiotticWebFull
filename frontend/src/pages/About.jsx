
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BASE_URL } from '../config';
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Lightbulb,
  Zap,
  Globe,
  TrendingUp
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovación',
      description: 'Buscamos constantemente nuevas formas de mejorar y optimizar los procesos agrícolas.'
    },
    {
      icon: Globe,
      title: 'Sostenibilidad',
      description: 'Desarrollamos soluciones que respetan y protegen el medio ambiente.'
    },
    {
      icon: Award,
      title: 'Excelencia',
      description: 'Nos comprometemos con la calidad y la mejora continua en todo lo que hacemos.'
    }
  ];

  const team = [
    {
      name: 'Carlos Corzo',
      role: 'CEO y Fundador',
      description: 'Líder visionario con más de 15 años de experiencia en tecnología agrícola y gestión empresarial.',
      image: `${BASE_URL}/uploads/corzo.png`
    },
    {
      name: 'Jhon A Hernández',
      role: 'Ingeniero de Desarrollo y co Fundador',
      description: 'Ingeniero electronico y desorrollador de sistemas.',
      image: `${BASE_URL}/uploads/alex.png`
    },
    {
      name: 'Ruth González',
      role: 'Director Comercial',
      description: 'Experto en desarrollo de negocios con amplia experiencia en el sector agroindustrial.',
      image: `${BASE_URL}/uploads/ruth.png`
    },
    {
      name: 'Carlos Mario Corzo',
      role: 'Negocios internacionales',
      description: 'Experto en comercio internacional y estrategias de mercado.',
      image: `${BASE_URL}/uploads/CarlosM.png`
    }
  ];

  const milestones = [
    {
      year: '2019',
      title: 'Fundación de Biottic',
      description: 'Inicio de operaciones con enfoque en automatización agrícola.'
    },
    {
      year: '2020',
      title: 'Primer Sistema IoT',
      description: 'Lanzamiento del primer sistema de riego inteligente.'
    },
    {
      year: '2021',
      title: 'Expansión Educativa',
      description: 'Desarrollo del módulo Biobot para instituciones académicas.'
    },
    {
      year: '2022',
      title: 'Reconocimiento Nacional',
      description: 'Premio a la Innovación Tecnológica Colombiana.'
    },
    {
      year: '2023',
      title: 'Plataforma Web',
      description: 'Lanzamiento de plataforma de monitoreo remoto.'
    },
    {
      year: '2024',
      title: 'Expansión Regional',
      description: 'Presencia en 5 países de Latinoamérica.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Nosotros - Biottic | Innovación Tecnológica Colombiana</title>
        <meta name="description" content="Conoce la historia, misión y equipo de Biottic. Empresa colombiana líder en desarrollo de tecnología IoT, automatización y dispositivos electrónicos innovadores." />
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
                Conoce a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">Biottic</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Somos una empresa colombiana apasionada por transformar ideas innovadoras 
                en soluciones tecnológicas que impactan positivamente el mundo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">Nuestra Misión</h2>
                </div>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  En Biottic, nos dedicamos a revolucionar el sector agropecuario a través de soluciones tecnológicas innovadoras y sostenibles. Nuestro objetivo es empoderar a los agricultores con herramientas que optimicen sus operaciones y mejoren su productividad.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-xl">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    "Creemos que la tecnología debe ser accesible, confiable y generar un impacto 
                    positivo real en la vida de las personas."
                  </p>
                </div>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">Nuestra Visión</h2>
                </div>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Aspiramos a ser líderes globales en la transformación digital del sector agrícola, creando un futuro donde la tecnología y la agricultura trabajen en perfecta armonía para garantizar la seguridad alimentaria y la sostenibilidad ambiental.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-xl">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    "Aspiramos a ser el puente entre la tecnología avanzada y las necesidades 
                    reales de nuestros clientes, creando un futuro más inteligente y sostenible."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Nuestros <span className="text-gradient">Valores</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Los principios que guían cada decisión y acción en Biottic
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg card-hover text-center min-h-0"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Nuestra <span className="text-gradient">Historia</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Un recorrido por los hitos más importantes de Biottic
              </p>
            </motion.div>

            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 md:left-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 to-blue-700 transform md:-translate-x-1/2"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>

                    {/* Content */}
                    <div
                      className={`ml-10 md:ml-0 md:grid md:grid-cols-2 md:gap-x-16`}
                    >
                      <div className={`${index % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2 md:text-left'}`}>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{milestone.year}</p>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{milestone.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Nuestro <span className="text-gradient">Equipo</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Profesionales apasionados por la tecnología y comprometidos con la excelencia
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={member.name}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg card-hover text-center min-h-0"
                >
                  <img loading="lazy" src={member.image} alt={member.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 object-cover"/>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {member.name}
                  </h3>
                  
                  <div className="text-blue-600 dark:text-blue-400 font-semibold mb-4">
                    {member.role}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Biottic en Números
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[ // Changed to use the correct icons and text
                { icon: Users, number: '500+', label: 'Proyectos Completados' },
                { icon: Award, number: '50+', label: 'Clientes Satisfechos' },
                { icon: TrendingUp, number: '5+', label: 'Años de Experiencia' },
                { icon: Zap, number: '24/7', label: 'Soporte Técnico' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
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
    </>
  );
};

export default About;

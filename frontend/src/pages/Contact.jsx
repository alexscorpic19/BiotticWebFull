import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  Building,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '@/utils/axiosConfig';

const schema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  email: yup.string().email('El email no es válido').required('El email es requerido'),
  phone: yup.string().required('El teléfono es requerido'),
  company: yup.string(),
  subject: yup.string(),
  message: yup.string().required('El mensaje es requerido'),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await axios.post('/contact', data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      console.error("Error sending contact form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Correo Electrónico',
      details: ['info@biottic.com.co', 'ventas@biottic.com.co'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      details: ['+57 (1) 234-5678', '+57 3174133379'],
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      details: ['Bucaramanga, Colombia', 'Carrera 33 #93-47, Oficina 501'],
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Clock,
      title: 'Horario de Atención',
      details: ['Lunes a Viernes: 8:00 AM - 6:00 PM', 'Sábados: 8:00 AM - 12:00 PM'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  const reasons = [
    {
      icon: CheckCircle,
      title: 'Consultas Técnicas',
      description: 'Asesoramiento especializado sobre nuestros productos y soluciones.'
    },
    {
      icon: CheckCircle,
      title: 'Cotizaciones',
      description: 'Solicita presupuestos personalizados para tus proyectos.'
    },
    {
      icon: CheckCircle,
      title: 'Soporte Post-Venta',
      description: 'Asistencia técnica y mantenimiento de equipos instalados.'
    },
    {
      icon: CheckCircle,
      title: 'Alianzas Comerciales',
      description: 'Oportunidades de colaboración y distribución.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contacto - Biottic | Contáctanos para Soluciones Tecnológicas</title>
        <meta name="description" content="Contáctanos para consultas técnicas, cotizaciones y soporte. Estamos en Bogotá, Colombia. Teléfono: +57 (1) 234-5678 | Email: info@biottic.com.co" />
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Contáctanos</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Estamos aquí para ayudarte. Conversemos sobre cómo nuestras soluciones tecnológicas pueden transformar tu proyecto.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
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
                Información de <span className="text-gradient">Contacto</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Múltiples formas de comunicarte con nosotros
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 card-hover text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {info.title}
                  </h3>
                  
                  <div className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 dark:text-gray-300">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>  
      </section>

      {/* Contact Form & Reasons */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    Envíanos un mensaje
                  </h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Nombre completo <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                          <input
                            type="text"
                            id="name"
                            {...register('name')}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Tu nombre completo"
                          />
                          {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Correo electrónico <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                          <input
                            type="email"
                            id="email"
                            {...register('email')}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="tu@email.com"
                          />
                          {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Teléfono <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                          <input
                            type="tel"
                            id="phone"
                            {...register('phone')}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="+57 300 123-4567"
                          />
                          {errors.phone && <p className="text-red-500 text-xs italic mt-1">{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Empresa
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                          <input
                            type="text"
                            id="company"
                            {...register('company')}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                            placeholder="Nombre de tu empresa"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Asunto
                      </label>
                      <select
                        id="subject"
                        {...register('subject')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      >
                        <option value="">Selecciona un asunto</option>
                        <option value="consulta-tecnica">Consulta Técnica</option>
                        <option value="cotizacion">Solicitud de Cotización</option>
                        <option value="soporte">Soporte Técnico</option>
                        <option value="alianza">Alianza Comercial</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Mensaje <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <textarea
                          id="message"
                          {...register('message')}
                          rows={6}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                          placeholder="Cuéntanos sobre tu proyecto o consulta..."
                        />
                        {errors.message && <p className="text-red-500 text-xs italic mt-1">{errors.message.message}</p>}
                      </div>
                    </div>

                    {submitStatus === 'success' && (
                      <div className="bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300" role="alert">
                        <span className="block sm:inline">¡Tu mensaje ha sido enviado con éxito!</span>
                      </div>
                    )}
                    {submitStatus === 'error' && (
                      <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300" role="alert">
                        <span className="block sm:inline">Ocurrió un error. Por favor, inténtalo de nuevo.</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full text-lg py-4"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* Reasons to Contact */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    ¿En qué podemos ayudarte?
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Nuestro equipo de expertos está listo para brindarte la mejor asesoría 
                    y soporte técnico. No importa el tamaño de tu proyecto, estamos aquí para ayudarte.
                  </p>
                </div>

                <div className="space-y-6">
                  {reasons.map((reason, index) => (
                    <motion.div
                      key={reason.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <reason.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {reason.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {reason.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Map Placeholder */}
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-2xl p-8 text-center">
                  <MapPin className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Visítanos en Bucaramanga
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Carrera 33 #93-47, Oficina 501<br />
                    Bucaramanga, Colombia
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    onClick={() => {
                      alert("🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀");
                    }}
                  >
                    Ver en el mapa
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
                Preguntas <span className="text-gradient">Frecuentes</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Respuestas a las consultas más comunes sobre nuestros productos y servicios
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: '¿Ofrecen instalación de los sistemas?',
                  answer: 'Sí, incluimos instalación profesional en todos nuestros sistemas. Nuestro equipo técnico se encarga de la configuración completa.'
                },
                {
                  question: '¿Qué garantía tienen los productos?',
                  answer: 'Todos nuestros productos incluyen garantía de 2 años completa, con soporte técnico 24/7 durante el primer año.'
                },
                {
                  question: '¿Realizan envíos a toda Colombia?',
                  answer: 'Sí, realizamos envíos a nivel nacional. El envío es gratuito en compras superiores a $1,000,000 COP.'
                },
                {
                  question: '¿Ofrecen capacitación para usar los sistemas?',
                  answer: 'Incluimos capacitación básica con la instalación. También ofrecemos cursos avanzados y certificaciones especializadas.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
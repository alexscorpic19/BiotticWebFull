import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TikTokIcon from '../icons/TikTokIcon';
import {
  Zap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Navegación',
      links: [
        { name: 'Inicio', path: '/' },
        { name: 'Sobre Nosotros', path: '/about' },
        { name: 'Biolabs', path: 'https://www.biolabs.biottic.com.co', external: true },
        { name: 'Productos', path: '/products' },
        { name: 'Contacto', path: '/contact' },
        { name: 'Seguimiento de Pedido', path: '/track-order' },
      ]
    },
    {
      title: 'Productos',
      links: [
        { name: 'Sistemas de Riego', path: '/products' },
        { name: 'Monitoreo Ambiental', path: '/products' },
        { name: 'Biobot Académico', path: '/products' },
        { name: 'Automatizaciones', path: '/products' },
      ]
    },
    {
      title: 'Servicios',
      links: [
        { name: 'Desarrollo IoT', path: '/contact' }, // Link to contact for services
        { name: 'Consultoría Técnica', path: '/contact' },
        { name: 'Soporte Técnico', path: '/contact' },
        { name: 'Capacitación', path: '/contact' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/biottic', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/biottic', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/biottic.col/', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/biottic/', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://www.youtube.com/channel/UC6a-aZ_0_0_0_0_0_0_0_0_A', label: 'YouTube' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@biottic', label: 'TikTok' },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <img loading="lazy" src="/images/logo.png" alt="Biottic Logo" className="h-12 w-auto" />
              <span className="text-3xl font-bold">Biottic</span>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Desarrollamos tecnología innovadora para automatización y monitoreo.
              Nuestros dispositivos electrónicos transforman la manera en que interactúas
              con tu entorno, ofreciendo soluciones inteligentes y eficientes.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-600 dark:text-gray-300">info@biottic.com.co</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-600 dark:text-gray-300">+57 3174133379</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-600 dark:text-gray-300">Bucaramanga, Colombia</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <span className="text-lg font-semibold mb-4 block text-gray-900 dark:text-white">
                {section.title}
              </span>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © {currentYear} Biottic. Todos los derechos reservados.
              </p>
              
              {/* Social Links */}
              <div className="flex flex-col items-center space-y-2">
                <h3 className="text-lg font-semibold">Siguenos en:</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white hover:bg-blue-500 transition-all duration-200"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
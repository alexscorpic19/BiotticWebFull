import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Sun, Moon, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isInvestigacionOpen, setIsInvestigacionOpen] = useState(false);
  const [isMobileInvestigacionOpen, setIsMobileInvestigacionOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { userInfo, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const logoutHandler = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Productos', path: '/products' },
    {
      name: 'Investigación',
      dropdown: [
        { name: 'Proyectos', path: '/investigacion/proyectos' },
      ]
    },
    { name: 'Contacto', path: '/contact' },
    { name: 'Biolabs', path: 'https://biolabs.biottic.com.co', external: true },
  ];

  const adminNavItems = [
    { name: 'Admin Contacts', path: '/admin/contacts' },
    { name: 'Admin Products', path: '/admin/products' },
    { name: 'Admin Orders', path: '/admin/orders' },
    { name: 'Admin Proyectos', path: '/admin/proyectos' },
  ];

  const linkClasses = (scrolled, isActive) => {
    let classes = 'relative px-3 py-2 text-sm font-medium transition-colors duration-200 ';
    if (isActive) {
      classes += 'text-emerald-600 dark:text-emerald-400'; // Consistent active color
            } else {
              classes += scrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400' 
                : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'; // Changed text-white to text-gray-700
            }    return classes;
  };
  
  const externalLinkClasses = (scrolled) => {
    return `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      scrolled
        ? 'text-gray-700 hover:text-emerald-600'
        : 'text-gray-700 hover:text-emerald-600' // Consistent dark color
    }`;
  }


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img loading="lazy" src="/images/logo.png" alt="Biottic Logo" className="h-10 w-auto" />
            <span className={`text-2xl font-bold transition-colors duration-200 ${scrolled ? 'text-biottic-blue' : 'text-gray-700'}`}>Biottic</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) =>
              item.dropdown ? (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setIsInvestigacionOpen(true)}
                  onMouseLeave={() => setIsInvestigacionOpen(false)}
                >
                  <button className={`${linkClasses(scrolled, location.pathname.startsWith('/investigacion'))} flex items-center`}>
                    {item.name}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  <AnimatePresence>
                    {isInvestigacionOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700"
                      >
                        {item.dropdown.map(subItem => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : item.external ? (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={externalLinkClasses(scrolled)}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={linkClasses(scrolled, location.pathname === item.path)}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId={`activeTab-${item.name}`}
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${scrolled ? 'bg-blue-600' : 'bg-blue-300'}`}
                    />
                  )}
                </Link>
              )
            )}

            {userInfo && userInfo.role === 'admin' && (
              <>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={linkClasses(scrolled, location.pathname.startsWith(item.path))}
                  >
                    {item.name}
                    {location.pathname.startsWith(item.path) && (
                      <motion.div
                        layoutId={`activeTab-${item.name}`}
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${scrolled ? 'bg-emerald-600' : 'bg-emerald-300'}`}
                      />
                    )}
                  </Link>
                ))}
                <Button
                  onClick={logoutHandler}
                  variant="outline"
                  size="sm"
                  className={`relative border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 dark:border-gray-600 dark:hover:bg-red-900/50`}
                >
                  <User className="w-4 h-4 mr-2" /> Logout
                </Button>
              </>
            )}

            <Button onClick={toggleTheme} variant="outline" size="sm" className={`relative ${scrolled ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            <Button onClick={onCartClick} variant="outline" size="sm" className={`relative ${scrolled ? 'border-gray-300 text-gray-700 hover:bg-emerald-50' : 'border-gray-300 text-gray-700 hover:bg-emerald-50'}`}>
              <ShoppingCart className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button onClick={toggleTheme} size="sm" className={`relative rounded-md p-2 transition-colors duration-200 ${scrolled ? 'border border-gray-300 text-gray-700 hover:bg-gray-100' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            <Button onClick={onCartClick} size="sm" className={`relative rounded-md p-2 transition-colors duration-200 ${scrolled ? 'border border-gray-300 text-gray-700 hover:bg-gray-100' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
              <ShoppingCart className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div key={item.name}>
                    <button 
                      onClick={() => setIsMobileInvestigacionOpen(!isMobileInvestigacionOpen)}
                      className="w-full flex justify-between items-center px-3 py-2 text-base font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${isMobileInvestigacionOpen ? 'transform rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isMobileInvestigacionOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 mt-1 space-y-1"
                        >
                          {item.dropdown.map(subItem => (
                             <Link
                              key={subItem.name}
                              to={subItem.path}
                              onClick={() => setIsOpen(false)}
                              className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                                location.pathname === subItem.path
                                  ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/50 dark:text-emerald-400'
                                  : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : item.external ? (
                  <a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/50 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
              {userInfo && userInfo.role === 'admin' && (
                <>
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                        location.pathname.startsWith(item.path)
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button
                    onClick={() => {
                      logoutHandler();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start mt-2 border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    <User className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Header;
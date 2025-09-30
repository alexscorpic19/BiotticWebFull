import axios from '@/utils/axiosConfig';
import ProductCard from '../components/ProductCard'; // Import ProductCard
import React, { useState, useEffect } from 'react';
import { Zap, Droplets, Monitor, Bot, Search, Shield, Wifi, ShoppingCart, Star, Filter, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet'; // Re-add Helmet import
import { motion } from 'framer-motion';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Removed useCart and handleAddToCart from here, as ProductCard will handle it

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]); // New state for categories

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products'); // Use axiosConfig
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los productos.');
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories([{ _id: 'all', name: 'Todos los productos', internalName: 'all', icon: Zap }, ...data.map(cat => ({ ...cat, internalName: cat.name }))]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' ||
                         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // Only show active products
    return matchesSearch && matchesCategory && (selectedCategory === 'all' || product.active);
  });

  // handleAddToCart is now handled within ProductCard

  if (loading) return <div className="text-center text-xl mt-8">Cargando productos...</div>;
  if (error) return <div className="text-center text-xl mt-8 text-red-500">Error: {error}</div>;

  return (
    <>
      <Helmet>
        <title>Productos - Biottic | Tienda de Tecnología IoT</title>
        <meta name="description" content="Descubre nuestra gama completa de productos tecnológicos: sistemas de riego inteligente, dispositivos de monitoreo ambiental y módulos educativos Biobot." />
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
                Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Tienda</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Descubre nuestra gama completa de productos tecnológicos diseñados para transformar tu mundo
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 items-center"> {/* Changed to flex-col and items-center */}
              {/* Search */}
              <div className="relative w-full max-w-md mx-auto"> {/* Added w-full and mx-auto, removed flex-1 */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center"> {/* Added justify-center for categories */}
                {categories.map((category) => (
                  <button
                    key={category._id} // Use _id from fetched categories
                    onClick={() => setSelectedCategory(category.internalName)} // Use internalName for selection
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.internalName
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {/* Render icon only if it exists (for hardcoded ones like Zap) */}
                    {category.icon && <category.icon className="w-4 h-4" />}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 dark:text-gray-300">Intenta con otros términos de búsqueda o categorías.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
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
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                ¿Por qué elegir nuestros <span className="text-gradient">productos</span>?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Garantía Extendida',
                  description: 'Todos nuestros productos incluyen garantía de 2 años y soporte técnico especializado.'
                },
                {
                  icon: Wifi,
                  title: 'Conectividad IoT',
                  description: 'Tecnología de vanguardia con conectividad inalámbrica y control remoto avanzado.'
                },
                {
                  icon: Zap,
                  title: 'Eficiencia Energética',
                  description: 'Diseñados para optimizar el consumo energético y reducir costos operativos.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
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

export default Products;
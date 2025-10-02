import React, { useEffect, useState } from 'react';
import axios from '@/utils/axiosConfig';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { Helmet } from 'react-helmet'; // Import Helmet
import { motion } from 'framer-motion'; // Import motion for animations
import { ShoppingCart, FileText } from 'lucide-react'; // Import ShoppingCart and FileText icons
import { Button } from '../components/ui/Button'; // Import Button component

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState('');
  const [showPdfs, setShowPdfs] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]); // Set first image as main
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      alert(`${product.name} added to cart!`); // Simple notification
    }
  };

  if (loading) return <div className="text-center text-xl mt-8">Cargando detalles del producto...</div>;
  if (error) return <div className="text-center text-xl mt-8 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center text-xl mt-8">Producto no encontrado.</div>;

  return (
    <>
      <Helmet>
        <title>{product.name} - Biottic</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-green-900 via-blue-600 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20"></div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                  {product.name}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Detalles completos de nuestro producto.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl dark:shadow-gray-900/50 rounded-lg">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              {mainImage && (
                <img loading="lazy" src={mainImage} alt={product.name} className="w-full h-auto rounded-lg shadow-md mb-4" />
              )}
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => {
                  const borderClass = mainImage === image ? 'border-primary' : 'border-transparent';
                  return (
                    <img
                      loading="lazy"
                      key={index}
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${borderClass}`}
                      onClick={() => setMainImage(image)}
                    />
                  );
                })}
              </div>
            </div>
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">{product.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">Categoría: {product.category}</p>
              <p className="text-green-600 dark:text-green-400 text-3xl font-bold mb-4">{formatPrice(product.price)}</p>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-6 whitespace-pre-wrap">{product.description}</p>
              <p className="text-gray-700 dark:text-gray-200 mb-2">Stock: {product.stock}</p>
              <p className="text-gray-700 dark:text-gray-200 mb-6">Estado: {product.active ? 'Disponible' : 'No disponible'}</p>

              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleAddToCart}
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al Carrito
                </Button>

                {product.pdfs && product.pdfs.length > 0 && (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowPdfs(!showPdfs)}
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Archivos
                    </Button>
                    {showPdfs && (
                      <div className="absolute mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
                        {product.pdfs.map((pdf, index) => (
                          <a
                            key={index}
                            href={pdf.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            {pdf.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
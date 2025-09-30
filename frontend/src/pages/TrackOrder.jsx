import React, { useState } from 'react';
import axios from '@/utils/axiosConfig';
import { FaShippingFast } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Added import
import { Helmet } from 'react-helmet'; // Added import

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Por favor, introduce un ID de orden.');
      return;
    }
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const { data } = await axios.get(`/orders/status/${orderId.trim()}`);
      console.log('Order data received:', data); // Added console.log
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo encontrar la orden. Verifica el ID e inténtalo de nuevo.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'Completed': return 'Completado';
      case 'Delivered': return 'Entregado';
      case 'Pending': return 'Pendiente';
      case 'Processing': return 'Procesando';
      case 'Failed': return 'Fallido';
      case 'Cancelled': return 'Cancelado';
      case 'Shipped': return 'Enviado';
      case 'paid': return 'Pagado'; // For paymentStatus
      case 'pending': return 'Pendiente'; // For paymentStatus
      default: return status;
    }
  };

  return (
    <> {/* Use Fragment for Helmet */}
      <Helmet>
        <title>Seguimiento de Pedido - Biottic | Rastrea tu Orden</title>
        <meta name="description" content="Rastrea el estado de tu pedido en Biottic. Introduce tu ID de orden para obtener información actualizada sobre el envío." />
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Seguimiento de Pedido</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Introduce el ID de tu orden para ver el estado y la información de envío.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
        <div className="container mx-auto p-4 -mt-10">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Introduce tu ID de Orden"
                className="flex-grow px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 disabled:bg-primary-300"
              >
                {loading ? 'Buscando...' : 'Rastrear'}
              </button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {order && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400">Detalles de la Orden</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                  <p><strong>ID de Orden:</strong> {order._id}</p>
                  <p><strong>Estado:</strong> <span className="font-semibold text-lg text-green-600 dark:text-green-400">{translateStatus(order.orderStatus)}</span></p>
                  <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  
                </div>

                {order.orderStatus === 'Shipped' && order.trackingNumber && (
                  <div className="mt-6 pt-4 border-t dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      <FaShippingFast />
                      Información de Envío
                    </h3>
                    <p><strong>Empresa Transportadora:</strong> {order.shippingCompany}</p>
                    <p><strong>Número de Guía:</strong> {order.trackingNumber}</p>
                  </div>
                )}

                
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOrder;

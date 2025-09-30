import React, { useState, useEffect } from 'react';
import axios from '@/utils/axiosConfig';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader, Search, Trash2, Download } from 'lucide-react'; // Added Download
import AdminHero from '@/components/admin/AdminHero';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders');
        setOrders(data);
      } catch (err) {
        setError('No se pudieron cargar las órdenes.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`/orders/${id}`); // Assuming axiosConfig handles base URL
        setOrders(orders.filter((order) => order._id !== id));
      } catch (err) {
        console.error('Error deleting order:', err);
        setError('Failed to delete order.');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/orders/export', {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders.json'); // Or any other filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error exporting orders:', err);
      setError('Failed to export orders.');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'success';
      case 'Pending':
      case 'Processing':
        return 'warning';
      case 'Failed':
      case 'Cancelled':
        return 'destructive';
      case 'Shipped':
        return 'info';
      default:
        return 'secondary';
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

  const filteredOrders = orders.filter(order =>
    (order.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Admin - Gestión de Órdenes</title>
        <meta name="description" content="Panel de administración para gestionar órdenes." />
      </Helmet>

      <AdminHero 
        title="Gestión de <span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300'>Órdenes</span>"
        subtitle="Administra y revisa el estado de todas las órdenes de compra."
      />

      <div className="container mx-auto p-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div className="relative max-w-md flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por cliente o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Button onClick={handleExport} className="ml-4">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-xl mt-8 flex items-center justify-center dark:text-gray-300">
            <Loader className="animate-spin mr-2" size={24} /> Cargando órdenes...
          </div>
        ) : error ? (
          <div className="text-center text-xl mt-8 text-red-500">Error: {error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado Pago</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado Orden</th>
                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{order.customer?.name || 'N/A'}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-semibold">{formatPrice(order.total)}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm">
                          <Badge variant={getStatusVariant(order.paymentStatus)}>{translateStatus(order.paymentStatus)}</Badge>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm">
                          <Badge variant={getStatusVariant(order.orderStatus)}>{translateStatus(order.orderStatus)}</Badge>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-right flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/admin/orders/${order._id}`}>Ver Detalles</Link>
                          </Button>
                          <Button
                            variant="destructive" // Using destructive variant for delete button
                            size="sm"
                            onClick={() => handleDelete(order._id)}
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No se encontraron órdenes</h3>
                        <p className="text-gray-600 dark:text-gray-300">Intenta con otro término de búsqueda.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default OrderList;

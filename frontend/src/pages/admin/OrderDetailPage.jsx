import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '@/utils/axiosConfig';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/Input';
import AdminHero from '@/components/admin/AdminHero';
import { Loader, ArrowLeft } from 'lucide-react';

const InfoRow = ({ label, value, className = '' }) => (
  <div className={`flex justify-between items-center py-3 border-b dark:border-gray-700 ${className}`}>
    <span className="text-gray-600 dark:text-gray-300 font-medium">{label}</span>
    <span className="text-gray-800 dark:text-gray-100 font-semibold text-right">{value}</span>
  </div>
);

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingCompany, setShippingCompany] = useState(''); // New state for shipping company

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/orders/${id}`);
        setOrder(data);
        setTrackingNumber(data.trackingNumber || '');
        setShippingCompany(data.shippingCompany || ''); // Initialize shipping company
      } catch (err) {
        setError('No se pudieron cargar los detalles de la orden.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async () => {
    if (!order?.orderStatus) return;
    try {
      const payload = {
        orderStatus: order.orderStatus,
        trackingNumber: trackingNumber,
        shippingCompany: shippingCompany, // Include shipping company in payload
      };
      await axios.put(`/orders/${id}/status`, payload);
      alert('Estado de la orden actualizado con éxito');
      navigate('/admin/orders');
    } catch (err) {
      alert('Error al actualizar el estado de la orden.');
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

  const renderContent = () => {
    if (loading) return (
      <div className="text-center text-xl mt-8 flex items-center justify-center dark:text-gray-300">
        <Loader className="animate-spin mr-2" size={24} /> Cargando detalles...
      </div>
    );
    if (error) return <div className="text-center text-xl mt-8 text-red-500">Error: {error}</div>;
    if (!order) return <div className="text-center text-xl mt-8 dark:text-gray-300">Orden no encontrada.</div>;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Productos en la Orden</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio Unit.</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {order.products?.map(item => (
                    <tr key={item.product?._id || item._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 dark:text-gray-200">{item.product?.name || 'Producto no disponible'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center dark:text-gray-300">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{item.product ? formatPrice(item.product.price) : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-right dark:text-gray-200">{item.product ? formatPrice(item.quantity * item.product.price) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
             <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Resumen Financiero</h2>
             <div className="space-y-2">
                <InfoRow label="Total de la Orden" value={formatPrice(order.total)} className="text-xl"/>
             </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1 space-y-8">
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Cliente</h2>
            <InfoRow label="Nombre" value={order.customer?.name} />
            <InfoRow label="Email" value={order.customer?.email} />
            <InfoRow label="Teléfono" value={order.customer?.phone} />
            <InfoRow label="Dirección" value={order.customer?.address} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Detalles del Pago</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2 dark:text-gray-200">Estado del Pago</p>
                <Badge variant={getStatusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
              </div>
              {order.paymentReference && (
                <div>
                  <p className="font-medium mb-2 dark:text-gray-200">Referencia Wompi</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded-md font-mono">{order.paymentReference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">Estado de la Orden</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2 dark:text-gray-200">Actualizar Estado del Envío</p>
                <Select 
                  value={order?.orderStatus || ''} 
                  onValueChange={(newStatus) => setOrder({ ...order, orderStatus: newStatus })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pendiente</SelectItem>
                        <SelectItem value="Processing">Procesando</SelectItem>
                        <SelectItem value="Shipped">Enviado</SelectItem>
                        <SelectItem value="Completed">Completado</SelectItem>
                        <SelectItem value="Failed">Fallido</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              {order?.orderStatus === 'Shipped' && (
                <>
                  <div>
                    <p className="font-medium mb-2 dark:text-gray-200">Número de Guía</p>
                    <Input
                      type="text"
                      placeholder="Ingrese el número de guía"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="font-medium mb-2 dark:text-gray-200">Transportadora</p>
                    <Select
                      value={shippingCompany}
                      onValueChange={(newCompany) => setShippingCompany(newCompany)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar transportadora" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Envia">Envia</SelectItem>
                        <SelectItem value="Servientrega">Servientrega</SelectItem>
                        <SelectItem value="Interrapidisimo">Interrapidisimo</SelectItem>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="Fedex">Fedex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button onClick={handleStatusChange} className="w-full">Actualizar</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Admin - Detalles de la Orden</title>
      </Helmet>

      <AdminHero 
        title="Detalles de la <span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300'>Orden</span>"
        subtitle={`Revisando los detalles de la orden ID: ${id}`}
      />

      <div className="container mx-auto p-4 py-12">
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link to="/admin/orders" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la Lista de Órdenes
            </Link>
          </Button>
        </div>
        {renderContent()}
      </div>
    </>
  );
};

export default OrderDetailPage;

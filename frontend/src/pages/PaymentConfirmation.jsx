import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from '@/utils/axiosConfig';
import { Helmet } from 'react-helmet';
import { CheckCircle, XCircle, Loader, AlertTriangle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PaymentConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    console.log('PaymentConfirmation useEffect triggered.');
    const fetchOrderDetails = async () => {
      const params = new URLSearchParams(location.search);
      const orderId = params.get('orderId'); // Get our internal order ID

      if (!orderId) {
        setError('No se encontró un ID de orden.');
        setLoading(false);
        return;
      }

      try {
        // Wait a couple of seconds to give the webhook time to process
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Request our backend for order details using our internal order ID
        console.log(`Fetching order status for orderId: ${orderId}`);
        const { data } = await axios.get(`/orders/status/${orderId}`);
        setOrder(data);
        console.log('Order details received from backend:', data);

      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('No se pudo verificar el estado de la orden. Si acabas de pagar, espera unos momentos y refresca la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location]);

  const handleCopy = () => {
    if (order && order._id) {
      navigator.clipboard.writeText(order._id);
      alert('ID de la orden copiado al portapapeles.');
    }
  };

  const renderStatus = () => {
    if (loading) {
      return (
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 mx-auto text-gray-500 dark:text-gray-400" />
          <p className="mt-4 text-xl dark:text-gray-300">Verificando tu pago...</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Esto puede tardar un momento.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500" />
          <h2 className="mt-6 text-3xl font-bold dark:text-gray-100">Hubo un problema</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      );
    }

    if (!order) {
      return null;
    }

    switch (order.paymentStatus) {
      case 'paid':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <h2 className="mt-6 text-3xl font-bold dark:text-gray-100">¡Gracias por tu compra!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Tu pago ha sido aprobado. Tu orden está siendo procesada.</p>
            {order._id && (
              <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Guarda tu ID de orden para hacer seguimiento:</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <p className="text-lg font-mono text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-600 px-3 py-1 rounded">{order._id}</p>
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
                <Link to={`/track-order?orderId=${order._id}`} className="mt-4 inline-block text-sm text-primary dark:hover:text-primary-dark dark:text-primary-light hover:underline">
                  O haz clic aquí para ver el estado de tu orden.
                </Link>
              </div>
            )}
          </div>
        );
      case 'failed':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 mx-auto text-red-500" />
            <h2 className="mt-6 text-3xl font-bold dark:text-gray-100">Pago Fallido</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Tu pago no pudo ser procesado.</p>
          </div>
        );
      default: // 'pending' or other statuses
        return (
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500" />
            <h2 className="mt-6 text-3xl font-bold dark:text-gray-100">Pago Pendiente</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">El estado de tu pago es: {order.paymentStatus}. Si ya pagaste, el estado se actualizará en breve.</p>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Confirmación de Pago - Biottic</title>
      </Helmet>
      <div className="bg-gray-50 dark:bg-black min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          {renderStatus()}
          <div className="mt-8 text-center">
            <Link to="/products">
              <Button>Volver a la tienda</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentConfirmation;
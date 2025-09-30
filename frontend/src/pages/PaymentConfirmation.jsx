import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from '@/utils/axiosConfig';
import { Helmet } from 'react-helmet';
import { CheckCircle, XCircle, Loader, AlertTriangle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PaymentConfirmation = () => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    console.log('PaymentConfirmation useEffect triggered.');
    const fetchOrderDetails = async () => {
      const params = new URLSearchParams(location.search);
      const wompiTransactionId = params.get('id'); // Get Wompi's transaction ID

      if (!wompiTransactionId) {
        setError('No se encontró un ID de transacción de Wompi.');
        setLoading(false);
        return;
      }

      try {
        // Request our backend for order details using Wompi's transaction ID
        const { data } = await axios.get(`/orders/wompi-transaction/${wompiTransactionId}`);
        setTransaction({
          status: data.paymentStatus.toUpperCase(),
          reference: data._id,
          status_message: data.orderStatus,
        });
        setOrderId(data._id); // Set our internal order ID
        console.log('Wompi Transaction ID from URL:', wompiTransactionId);
        console.log('Calling backend for order details with URL:', `/orders/wompi-transaction/${wompiTransactionId}`);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('No se pudo verificar el estado de la orden.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location]);

  const handleCopy = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      alert('ID de la orden copiado al portapapeles.');
    }
  };

  const renderStatus = () => {
    if (loading) {
      return (
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 mx-auto text-gray-500 dark:text-gray-400" />
          <p className="mt-4 text-xl dark:text-gray-300">Verificando tu pago...</p>
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

    if (!transaction) {
      return null;
    }

    switch (transaction.status) {
      case 'PAID':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <h2 className="mt-6 text-3xl font-bold dark:text-gray-100">¡Gracias por tu compra!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Tu pago ha sido aprobado. Tu orden está siendo procesada.</p>
            {orderId && (
              <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Guarda tu ID de orden para hacer seguimiento:</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <p className="text-lg font-mono text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-600 px-3 py-1 rounded">{orderId}</p>
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
                <Link to={`/track-order?orderId=${orderId}`} className="mt-4 inline-block text-sm text-primary dark:hover:text-primary-dark dark:text-primary-light hover:underline">
                  O haz clic aquí para ver el estado de tu orden.
                </Link>
              </div>
            )}
          </div>
        );
      case 'FAILED':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 mx-auto text-red-500" />
            <h2 className="mt-6 text-3xl font-bold dark:text-gray-100">Pago Fallido</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{transaction.status_message || 'Tu pago no pudo ser procesado.'}</p>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500" />
            <h2 className="mt-6 text-3xl font-bold dark:text-gray-100">Estado Pendiente</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">El estado de tu pago es: {transaction.status_message}.</p>
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
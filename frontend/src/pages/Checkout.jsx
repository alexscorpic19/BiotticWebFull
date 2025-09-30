import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '@/utils/axiosConfig';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { formatPrice } from '@/lib/utils';

// Validation Schema for Customer Info
const customerSchema = yup.object().shape({
  name: yup.string().required('El nombre completo es requerido'),
  email: yup.string().email('Debe ser un email válido').required('El email es requerido'),
  phone: yup.string().required('El número de teléfono es requerido'),
  address: yup.string().required('La dirección es requerida'),
});

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(customerSchema),
  });

  const onSubmit = async (customerInfo) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Prepare order payload
      const orderPayload = {
        cartItems: cartItems.map(item => ({ _id: item._id, quantity: item.quantity })),
        customerInfo,
      };

      // 2. Request the signed Wompi URL from the backend
      const { data } = await axios.post('/orders', orderPayload);

      // 3. Redirect to Wompi if URL is received
      if (data.wompiUrl) {
        clearCart();
        window.location.href = data.wompiUrl;
      } else {
        throw new Error('No se recibió la URL de Wompi del servidor.');
      }

    } catch (err) {
      console.error('Error during checkout:', err);
      setError('No se pudo procesar la orden. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Tu carrito está vacío</h1>
        <p className="text-gray-600 mt-2">Añade productos para poder finalizar la compra.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Biottic</title>
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 bg-gradient-to-br from-green-900 via-blue-800 to-teal-800">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">Finalizar Compra</h1>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 -mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" {...register('name')} />
                    <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                    <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" {...register('phone')} />
                    <p className="text-red-500 text-sm mt-1">{errors.phone?.message}</p>
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" type="text" {...register('address')} />
                    <p className="text-red-500 text-sm mt-1">{errors.address?.message}</p>
                  </div>
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Procesando...' : `Pagar ${formatPrice(getCartTotal())} con Wompi`}
                  </Button>
                </form>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6">Resumen de la Orden</h2>
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-6 pt-6 flex justify-between items-center">
                  <p className="text-xl font-bold">Total</p>
                  <p className="text-xl font-bold text-blue-600">{formatPrice(getCartTotal())}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
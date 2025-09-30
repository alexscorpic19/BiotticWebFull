import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '@/lib/utils';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      alert("El producto se eliminó del carrito.");
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    alert(`${productName} se eliminó del carrito.`);
  };

  const handleClearCart = () => {
    clearCart();
    alert("Todos los productos se eliminaron del carrito.");
  };

  const handleCheckout = () => {
    alert('🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 100000 ? 0 : 15000; // Envío gratis para compras superiores a 100.000 COP
  const tax = subtotal * 0.19; // 19% IVA Colombia
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Carrito de Compras - Biottic</title>
          <meta name="description" content="Tu carrito de compras está vacío. Descubre nuestros productos tecnológicos innovadores." />
        </Helmet>

        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tu carrito está vacío
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Descubre nuestros productos tecnológicos innovadores y encuentra la solución perfecta para tus necesidades.
              </p>

              <Link to="/products">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Explorar productos
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Carrito de Compras - Biottic</title>
        <meta name="description" content={`Revisa y completa tu compra de productos Biottic. Total: ${formatPrice(total)}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-900 via-blue-800 to-teal-800 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Carrito de Compras
                </h1>
                <p className="text-gray-200 mt-2">
                  {cartItems.length} producto{cartItems.length !== 1 ? 's' : ''} en tu carrito
                </p>
              </div>
              
              {cartItems.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-white border-white hover:bg-white/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Vaciar carrito
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item._id} // Use item._id
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="w-full md:w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex-shrink-0">
                        <img loading="lazy" 
                          className="w-full h-full object-cover rounded-xl"
                          alt={item.name}
                          src={item.images && item.images.length > 0 ? `http://localhost:3000${item.images[0]}` : 'https://via.placeholder.com/128'} // Use actual product image
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div className="flex-1 mb-4 md:mb-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {item.description}
                            </p>

                            <div className="flex items-center space-x-4">
                              <span className="text-2xl font-bold text-emerald-600">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)} // Use item._id
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              
                              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)} // Use item._id
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item._id, item.name)} // Use item._id
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-xl font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-lg p-8 sticky top-24"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Resumen del pedido
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">Gratis</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (19%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-emerald-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-emerald-500" />
                    <span>Envío gratuito en compras +{formatPrice(100000)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    <span>Múltiples métodos de pago</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-4 mb-4"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceder al pago
                  </Button>
                </Link>

                <Link to="/products" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Seguir comprando
                  </Button>
                </Link>

                {/* Free Shipping Notice */}
                {subtotal < 100000 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>¡Envío gratis!</strong> Agrega {formatPrice(100000 - subtotal)} más para obtener envío gratuito.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
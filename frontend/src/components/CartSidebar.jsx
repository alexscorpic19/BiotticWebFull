import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } w-full md:w-1/3 lg:w-1/4 z-[60]`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-bold">Carrito de Compras</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          &times;
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100vh-150px)]">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">
            <FaShoppingCart className="mx-auto text-4xl mb-4" />
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  loading="lazy"
                  src={item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{formatPrice(item.price)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                  className="w-16 text-center border rounded-md"
                />
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-xl font-bold">{formatPrice(getCartTotal())}</span>
        </div>
        <Link
          to="/checkout"
          onClick={onClose} // Also close sidebar on click
          className={`w-full block text-center text-white py-2 rounded-md transition-colors ${
            cartItems.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          // Prevent clicking if cart is empty
          style={cartItems.length === 0 ? { pointerEvents: 'none' } : {}}
        >
          Proceder al Pago
        </Link>
      </div>
    </div>
  );
};

export default CartSidebar;
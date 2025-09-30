import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { formatPrice } from '@/lib/utils';
import { BASE_URL } from '../config';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 dark:shadow-lg dark:shadow-gray-900/50">
      <Link to={`/products/${product._id}`}>
        <img loading="lazy" src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{product.category}</p>
        <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatPrice(product.price)}</p>
        <div className="mt-4 flex space-x-2">
          <Link to={`/products/${product._id}`} className="flex-1">
            <Button variant="outline" className="w-full">Ver Detalles</Button>
          </Link>
          <Button onClick={() => addToCart(product)} className="flex-1">Agregar al Carrito</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

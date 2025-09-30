import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the useCart hook
// This ensures that whenever useCart is called, it returns our mock object
vi.mock('../contexts/CartContext', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
    // Add any other functions/values that ProductCard might try to destructure from useCart
    // For ProductCard, only addToCart is used.
  }),
}));

// Mock the BASE_URL from config
vi.mock('../config', () => ({
  BASE_URL: 'http://localhost:3000/api',
}));

// Mock formatPrice from @/lib/utils
vi.mock('@/lib/utils', () => ({
  formatPrice: (price) => `$${price.toFixed(2)}`,
}));


describe('ProductCard', () => {
  const mockProduct = {
    _id: '1',
    name: 'Producto de Prueba',
    description: 'Esta es una descripción de prueba.',
    price: 123.45,
    category: 'Electrónica',
    images: ['/uploads/test-image.jpg'],
    stock: 10,
    active: true,
  };

  it('renders product information correctly', () => {
    render(
      <Router>
        <ProductCard product={mockProduct} />
      </Router>
    );

    // Assertions remain the same
    expect(screen.getByText(/Producto de Prueba/i)).toBeInTheDocument();
    expect(screen.getByText(/Electrónica/i)).toBeInTheDocument();
    expect(screen.getByText(/\$123.45/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver Detalles/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar al Carrito/i })).toBeInTheDocument();
    expect(screen.getByAltText(/Producto de Prueba/i)).toBeInTheDocument();
  });
});
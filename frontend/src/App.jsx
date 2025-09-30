import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import ContactMessages from './pages/admin/ContactMessages';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import OrderList from './pages/admin/OrderList';
import OrderDetailPage from './pages/admin/OrderDetailPage';
import CategoryManagement from './pages/admin/CategoryManagement';
import PaymentConfirmation from './pages/PaymentConfirmation';
import LoginPage from './pages/admin/LoginPage';
import AdminRoute from './components/AdminRoute';
import CartSidebar from './components/CartSidebar';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import ProjectsPage from './pages/investigacion/ProjectsPage';
import ProjectDetailPage from './pages/investigacion/ProjectDetailPage';
import AdminProjectPostList from './pages/admin/AdminProjectPostList';
import ProjectPostForm from './pages/admin/ProjectPostForm';

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header onCartClick={handleCartToggle} />
        <CartSidebar isOpen={isCartOpen} onClose={handleCartToggle} />
        <WhatsAppButton />
        <main className="flex-grow overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
            <Route path="/investigacion/proyectos" element={<ProjectsPage />} />
            <Route path="/investigacion/proyectos/:id" element={<ProjectDetailPage />} />
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<Navigate to="/admin/products" replace />} />
              <Route path="contacts" element={<ContactMessages />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="proyectos" element={<AdminProjectPostList />} />
              <Route path="proyectos/new" element={<ProjectPostForm />} />
              <Route path="proyectos/:id/edit" element={<ProjectPostForm />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoute = () => {
  const { userInfo, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  return userInfo && userInfo.role === 'admin' ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;

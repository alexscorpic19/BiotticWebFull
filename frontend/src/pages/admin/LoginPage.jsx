import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { motion } from 'framer-motion'; // Added import
import { Helmet } from 'react-helmet'; // Added import

const schema = yup.object().shape({
  email: yup.string().email('Debe ser un email válido').required('El email es requerido'),
  password: yup.string().required('La contraseña es requerida'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, userInfo, loading } = useAuth();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!loading && userInfo && userInfo.role === 'admin') {
      navigate('/admin/products');
    }
  }, [userInfo, loading, navigate]);

  const onSubmit = async (data) => {
    setError(null);
    try {
      await login(data.email, data.password);
      navigate('/admin/products'); // Redirigir al panel de administración
    } catch (err) {
      setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
      console.error('Error de inicio de sesión:', err);
    }
  };

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  return (
    <> {/* Use Fragment for Helmet */}
      <Helmet>
        <title>Iniciar Sesión Admin - Biottic | Acceso al Panel de Administración</title>
        <meta name="description" content="Accede al panel de administración de Biottic. Inicia sesión con tus credenciales de administrador." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-900 via-emerald-800 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20"></div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            > 
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Acceso de Administrador</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Inicia sesión para gestionar el contenido y las órdenes de Biottic.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
        <div className="container mx-auto p-4 -mt-10">
          <div className="max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg mx-auto"> {/* Added mx-auto for centering */}
            <h1 className="text-3xl font-bold text-center">Iniciar Sesión - Admin</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" {...register('password')} />
                <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
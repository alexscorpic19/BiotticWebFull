import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Loader } from 'lucide-react';
import AdminHero from '@/components/admin/AdminHero';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const AdminProjectPostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/project-posts');
      setPosts(response.data);
    } catch (err) {
      setError('No se pudieron cargar las publicaciones.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      try {
        await api.delete(`/admin/project-posts/${id}`);
        fetchPosts(); // Refresh list after delete
      } catch (err) {
        console.error(err);
        alert('No se pudo eliminar la publicación.');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin - Gestión de Proyectos</title>
      </Helmet>

      <AdminHero 
        title="Gestión de <span class='text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400'>Proyectos</span>"
        subtitle="Crea, edita y gestiona las publicaciones de investigación y proyectos."
      />

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-end mb-8">
          <Button asChild>
            <Link to="/admin/proyectos/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Crear Nuevo Proyecto
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-xl mt-8 flex items-center justify-center dark:text-gray-300">
            <Loader className="animate-spin mr-2" size={24} /> Cargando publicaciones...
          </div>
        ) : error ? (
          <div className="text-center text-xl mt-8 text-red-500">Error: {error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Título</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha de Creación</th>
                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/proyectos/${post._id}/edit`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteHandler(post._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AdminProjectPostList;
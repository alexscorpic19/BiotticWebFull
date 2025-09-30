import React, { useState, useEffect } from 'react';
import axios from '@/utils/axiosConfig';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Loader, PlusCircle, Edit, Trash2, List, Search, Download } from 'lucide-react';
import AdminHero from '@/components/admin/AdminHero';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products?admin=true');
        setProducts(data);
      } catch (err) {
        setError('No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert('Error al eliminar el producto.');
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/products/export', {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.json'); // Or any other filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error exporting products:', err);
      setError('Failed to export products.');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Admin - Gestión de Productos</title>
        <meta name="description" content="Panel de administración para gestionar productos." />
      </Helmet>

      <AdminHero 
        title="Gestión de <span class='text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300'>Productos</span>"
        subtitle="Añade, edita y elimina productos de tu tienda."
      >
        <div className="flex justify-center space-x-4 mt-4">
          <Button asChild>
            <Link to="/admin/products/new" className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear Nuevo Producto
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/categories" className="flex items-center">
              <List className="mr-2 h-5 w-5" /> {/* Using List icon for categories */}
              Gestionar Categorías
            </Link>
          </Button>
        </div>
      </AdminHero>

      <div className="container mx-auto p-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div className="relative max-w-md flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Button onClick={handleExport} className="ml-4">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-xl mt-8 flex items-center justify-center dark:text-gray-300">
            <Loader className="animate-spin mr-2" size={24} /> Cargando productos...
          </div>
        ) : error ? (
          <div className="text-center text-xl mt-8 text-red-500">Error: {error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoría</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{product.category}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{formatPrice(product.price)}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{product.stock}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.active ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                            {product.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/admin/products/${product._id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteProduct(product._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No se encontraron productos</h3>
                        <p className="text-gray-600 dark:text-gray-300">Intenta con otro término de búsqueda.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default ProductList;

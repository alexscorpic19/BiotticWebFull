import React, { useState, useEffect } from 'react';
import axios from '@/utils/axiosConfig';
import { Helmet } from 'react-helmet';
import AdminHero from '@/components/admin/AdminHero';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Trash2, Edit, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // Stores category being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/categories');
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch categories.');
      setLoading(false);
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    try {
      const { data } = await axios.post('/categories', { name: newCategoryName });
      setCategories([...categories, data]);
      setNewCategoryName('');
      alert('Category added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding category.');
      console.error('Error adding category:', err);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    try {
      const { data } = await axios.put(`/categories/${editingCategory._id}`, { name: editingCategory.name });
      setCategories(categories.map(cat => (cat._id === data._id ? data : cat)));
      setEditingCategory(null);
      alert('Category updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating category.');
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/categories/${id}`);
        setCategories(categories.filter(cat => cat._id !== id));
        alert('Category deleted successfully!');
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting category.');
        console.error('Error deleting category:', err);
      }
    }
  };

  if (loading) return <div className="text-center text-xl mt-8">Cargando categorías...</div>;
  if (error) return <div className="text-center text-xl mt-8 text-red-500">Error: {error}</div>;

  return (
    <>
      <Helmet>
        <title>Gestión de Categorías - Admin</title>
      </Helmet>

      <AdminHero
        title="Gestión de <span class='text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300'>Categorías</span>"
        subtitle="Administra las categorías de productos de tu tienda."
      >
        <Button asChild variant="outline" className="mt-4">
          <Link to="/admin/products" className="flex items-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Volver a Productos
          </Link>
        </Button>
      </AdminHero>

      <div className="container mx-auto p-4 py-12">
        <div className="bg-white p-8 shadow-lg rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingCategory ? 'Editar Categoría' : 'Añadir Nueva Categoría'}
          </h2>
          <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="space-y-4 mb-8">
            <div>
              <Label htmlFor="categoryName">Nombre de la Categoría</Label>
              <Input
                id="categoryName"
                type="text"
                value={editingCategory ? editingCategory.name : newCategoryName}
                onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, name: e.target.value }) : setNewCategoryName(e.target.value)}
                placeholder="Ej: Sistemas de Riego"
              />
            </div>
            <div className="flex space-x-4">
              <Button type="submit">
                {editingCategory ? 'Actualizar Categoría' : 'Añadir Categoría'}
              </Button>
              {editingCategory && (
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancelar Edición
                </Button>
              )}
            </div>
          </form>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías Existentes</h2>
          {categories.length === 0 ? (
            <p className="text-gray-600">No hay categorías creadas aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingCategory(category)}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryManagement;
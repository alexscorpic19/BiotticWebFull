import React, { useEffect, useState } from 'react';
import axios from '@/utils/axiosConfig';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { MessageSquare, Loader, Search, Trash2, Download, MailOpen } from 'lucide-react'; // Added Download
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button'; // Import Button component

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get('/contact'); 
        setMessages(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch contact messages.');
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`/contact/${id}`);
        setMessages(messages.filter((message) => message._id !== id));
      } catch (err) {
        console.error('Error deleting message:', err);
        setError('Failed to delete message.');
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const { data: updatedMessage } = await axios.put(`/contact/${id}/read`);
      setMessages(
        messages.map((message) =>
          message._id === id ? { ...message, read: true } : message
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
      setError('Failed to mark message as read.');
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/contact/export', {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contacts.json'); // Or any other filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error exporting messages:', err);
      setError('Failed to export messages.');
    }
  };

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Admin - Mensajes de Contacto</title>
        <meta name="description" content="Panel de administración para ver mensajes de contacto." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 hero-gradient overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Mensajes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Contacto</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Revisa los mensajes enviados a través del formulario de contacto.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto p-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div className="relative max-w-md flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar en mensajes..."
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
            <Loader className="animate-spin mr-2" size={24} /> Cargando mensajes...
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
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teléfono</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Empresa</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mensaje</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recibido</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th> {/* Added Actions header */}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                      <tr key={message._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{message.name}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{message.email}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{message.phone}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{message.company || 'N/A'}</td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">{message.message}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{new Date(message.createdAt).toLocaleString()}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                          {!message.read && (
                            <button
                              onClick={() => handleMarkAsRead(message._id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                              title="Mark as Read"
                            >
                              <MailOpen size={20} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(message._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete Message"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-16"> {/* Changed colSpan to 7 */}
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No se encontraron mensajes</h3>
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

export default ContactMessages;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

const ProjectsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Proyectos - Biottic</title>
        <meta name="description" content="Explora los proyectos de investigación y desarrollo de Biottic en tecnología agrícola, IoT y automatización." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-green-900 via-blue-800 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Proyectos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-green-400">Investigación</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Descubre cómo estamos aplicando la tecnología para resolver los desafíos del mañana en la agricultura y más allá.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {loading && <p className="text-center">Cargando proyectos...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col"
                >
                  {post.images && post.images[0] && (
                    <img loading="lazy" 
                      src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${post.images[0]}`}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 flex-grow">
                      {post.content.substring(0, 100)}...
                    </p>
                    <div className="mt-4 text-right">
                      <Button asChild variant="link" className="text-emerald-500 hover:text-emerald-600">
                        <Link to={`/investigacion/proyectos/${post._id}`}>
                          Leer Más <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;
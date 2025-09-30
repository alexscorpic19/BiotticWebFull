import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { api } from '@/lib/api';
import { ArrowLeft, Download, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoModal from '@/components/VideoModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/project-posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('No se pudo cargar la publicación.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const getFullUrl = (path) => `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${path}`;

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  if (loading) {
    return <div className="text-center py-40">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-40 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center py-40">Publicación no encontrada.</div>;
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(post.youtubeLink);
  // const allImages = [post.mainImage, ...post.images].filter(Boolean); // Removed this line

  return (
    <>
      <Helmet>
        <title>{post.title} - Proyectos Biottic</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-green-900 via-blue-800 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <Link to="/investigacion/proyectos" className="inline-flex items-center text-sm font-semibold text-teal-300 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Proyectos
                </Link>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-center text-gray-300">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Publicado el {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 lg:p-10"
          >
            {/* Main Image */}
            {post.mainImage && (
              <div className="mb-8">
                <img
                  loading="lazy"
                  src={getFullUrl(post.mainImage)}
                  alt={post.title}
                  className="w-full h-auto rounded-lg shadow-md object-cover"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="prose dark:prose-invert max-w-none lg:prose-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>{post.content}</p>
            </div>

            {/* Image Carousel (only gallery images) */}
            {post.images && post.images.length > 0 && (
              <div className="mt-12">
                <Swiper
                  modules={[Navigation, Pagination, Thumbs]}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  spaceBetween={10}
                  navigation={true}
                  pagination={{ clickable: true }}
                  className="mySwiper2 rounded-lg shadow-lg"
                >
                  {post.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        loading="lazy"
                        src={getFullUrl(image)}
                        alt={`${post.title} - imagen ${index + 1}`}
                        className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[Thumbs]}
                  className="mySwiper mt-4"
                >
                  {post.images.map((image, index) => (
                    <SwiperSlide key={index} className="cursor-pointer">
                      <img
                        loading="lazy"
                        src={getFullUrl(image)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border-2 border-transparent swiper-slide-thumb-active:border-emerald-500"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* YouTube Video Button */}
            {youtubeEmbedUrl && (
              <div className="mt-12 text-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg"
                  onClick={openModal}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Ver Video del Proyecto
                </Button>
              </div>
            )}

            {/* Attachments */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Archivos Adjuntos</h2>
                <ul className="space-y-4">
                  {post.attachments.map((attachment, index) => (
                    <li key={index}>
                      <a 
                        href={getFullUrl(attachment.path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-500 transition-colors font-medium group"
                      >
                        <Download className="w-5 h-5 mr-3 group-hover:translate-y-px transition-transform" />
                        <span>{attachment.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </motion.div>
        </div>
      </div>
      <VideoModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        videoUrl={youtubeEmbedUrl}
      />
    </>
  );
};

export default ProjectDetailPage;

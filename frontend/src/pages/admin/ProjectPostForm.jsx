import React, { useEffect, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { UploadCloud, File as FileIcon, ArrowLeft, X, Download } from 'lucide-react';
import AdminHero from '@/components/admin/AdminHero';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const schema = yup.object().shape({
  title: yup.string().required('El título es obligatorio'),
  content: yup.string().required('El contenido es obligatorio'),
  mainImage: yup.mixed().nullable(true),
  images: yup.mixed(),
  attachments: yup.mixed(), // Renamed from pdfDocuments
  youtubeLink: yup.string().url('Debe ser una URL válida').nullable(true).transform(value => value === '' ? null : value),
});

const ProjectPostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]); // New state for deleted attachments

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mainImage: null,
      youtubeLink: '',
      images: [],
      attachments: [], // Initialize attachments
    }
  });

  const onMainImageDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('mainImage', Object.assign(file, {
        preview: URL.createObjectURL(file)
      }), { shouldValidate: true });
    }
  }, [setValue]);

  const onImagesDrop = useCallback(acceptedFiles => {
    const currentImages = watch('images') || [];
    const newImages = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setValue('images', [...currentImages, ...newImages], { shouldValidate: true });
  }, [setValue, watch]);

  const onAttachmentsDrop = useCallback(acceptedFiles => { // Renamed from onPdfsDrop
    const currentAttachments = watch('attachments') || [];
    const newAttachments = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setValue('attachments', [...currentAttachments, ...newAttachments], { shouldValidate: true });
  }, [setValue, watch]);

  const { getRootProps: getMainImageRootProps, getInputProps: getMainImageInputProps } = useDropzone({ onDrop: onMainImageDrop, accept: { 'image/*': [] }, maxFiles: 1 });
  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({ onDrop: onImagesDrop, accept: { 'image/*': [] } });
  const { getRootProps: getAttachmentRootProps, getInputProps: getAttachmentInputProps } = useDropzone({ onDrop: onAttachmentsDrop }); // Removed accept: { 'application/pdf': [] }

  const mainImage = watch('mainImage');
  const images = watch('images');
  const attachments = watch('attachments'); // Renamed from pdfs

  useEffect(() => {
    if (isEditMode) {
      api.get(`/project-posts/${id}`)
        .then(response => {
          const { title, content, mainImage, youtubeLink, images: existingImages, attachments: existingAttachments } = response.data; // Renamed pdfDocuments to existingAttachments
          setValue('title', title);
          setValue('content', content);
          setValue('youtubeLink', youtubeLink || '');
          if (mainImage) {
            setValue('mainImage', { name: 'Imagen actual', preview: `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${mainImage}` });
          }
          if (existingImages && existingImages.length > 0) {
            setValue('images', existingImages.map(img => ({
              name: img.split('/').pop(),
              preview: `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${img}`,
              path: img,
            })));
          }
          if (existingAttachments && existingAttachments.length > 0) { // Handle existing attachments
            setValue('attachments', existingAttachments.map(att => ({
              ...att,
              preview: `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${att.path}`
            })));
          }
        })
        .catch(err => console.error('Failed to fetch post', err));
    }
  }, [id, isEditMode, setValue]);

  const handleRemoveImage = (imageToRemove) => {
    const currentImages = watch('images') || [];
    const newImages = currentImages.filter(image => image.preview !== imageToRemove.preview);
    setValue('images', newImages, { shouldValidate: true });

    if (imageToRemove.path) {
      setDeletedImages(prev => [...prev, imageToRemove.path]);
    }
  };

  const handleRemoveAttachment = (attachmentToRemove) => { // New function for removing attachments
    const currentAttachments = watch('attachments') || [];
    const newAttachments = currentAttachments.filter(att => att.preview !== attachmentToRemove.preview);
    setValue('attachments', newAttachments, { shouldValidate: true });

    if (attachmentToRemove.path) {
      setDeletedAttachments(prev => [...prev, attachmentToRemove.path]);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('youtubeLink', data.youtubeLink || '');

    if (data.mainImage instanceof File) {
      formData.append('mainImage', data.mainImage);
    } else if (data.mainImage === null) {
      formData.append('mainImage', '');
    }

    if (data.images) {
        const newImages = data.images.filter(img => img instanceof File);
        for (const image of newImages) {
            formData.append('images', image);
        }
    }
    
    if (deletedImages.length > 0) {
        formData.append('deletedImages', JSON.stringify(deletedImages));
    }

    if (data.attachments) { // Renamed from pdfDocuments
      const newAttachments = data.attachments.filter(att => att instanceof File);
      for (const attachment of newAttachments) {
        formData.append('attachments', attachment);
      }
    }
    
    if (deletedAttachments.length > 0) { // Handle deleted attachments
        formData.append('deletedAttachments', JSON.stringify(deletedAttachments));
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEditMode) {
        await api.put(`/admin/project-posts/${id}`, formData, config);
        alert('Proyecto actualizado con éxito');
      } else {
        await api.post('/admin/project-posts', formData, config);
        alert('Proyecto creado con éxito');
      }
      navigate('/admin/proyectos');
    } catch (error) {
      console.error('Failed to save the post', error);
      alert('Error al guardar la publicación.');
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Editar' : 'Crear'} Proyecto - Admin</title>
      </Helmet>

      <AdminHero 
        title={isEditMode ? "Editar <span class='text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400'>Proyecto</span>" : "Crear <span class='text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400'>Proyecto</span>"}
        subtitle="Rellena los detalles de la publicación del proyecto."
      />

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-start mb-8">
            <Button asChild variant="outline">
              <Link to="/admin/proyectos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la Lista
              </Link>
            </Button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <Label htmlFor="title" className="text-lg">Título</Label>
                <Input id="title" {...register('title')} className="mt-2" placeholder="Ej: Desarrollo de Sensor de Humedad" />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="content" className="text-lg">Contenido</Label>
                <Textarea id="content" {...register('content')} rows={10} className="mt-2" placeholder="Describe el proyecto en detalle..." />
                {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>}
              </div>

              {/* Main Image Upload */}
              <div>
                <Label className="text-lg">Imagen Principal</Label>
                <div {...getMainImageRootProps()} className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                  <input {...getMainImageInputProps()} />
                  <div className="space-y-2 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Arrastra y suelta la imagen principal aquí, o haz clic para seleccionar</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Solo se permite una imagen (PNG, JPG, etc.)</p>
                  </div>
                </div>
                {mainImage && (
                  <div className="mt-4 flex items-center space-x-4">
                    <img loading="lazy" src={mainImage.preview} alt="Preview" className="h-24 w-24 object-cover rounded-md" />
                    <span className="text-sm">{mainImage.name}</span>
                    <Button type="button" variant="destructive" size="sm" onClick={() => setValue('mainImage', null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {errors.mainImage && <p className="text-sm text-red-500 mt-1">{errors.mainImage.message}</p>}
              </div>

              {/* YouTube Link */}
              <div>
                <Label htmlFor="youtubeLink" className="text-lg">Enlace de YouTube (Opcional)</Label>
                <Input id="youtubeLink" {...register('youtubeLink')} className="mt-2" placeholder="Ej: https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
                {errors.youtubeLink && <p className="text-sm text-red-500 mt-1">{errors.youtubeLink.message}</p>}
              </div>

              {/* Images Gallery Upload */}
              <div>
                <Label className="text-lg">Imágenes de la Galería</Label>
                <div {...getImageRootProps()} className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                  <input {...getImageInputProps()} />
                  <div className="space-y-2 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Arrastra y suelta imágenes de la galería aquí, o haz clic para seleccionar</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Múltiples imágenes (PNG, JPG, etc.)</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Nota: El tamaño total de todos los archivos subidos (imágenes y adjuntos) no debe exceder los 15 MB.</p>
                {images && images.length > 0 && (
                  <div className="mt-4">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={16}
                      slidesPerView={2}
                      navigation
                      pagination={{ clickable: true }}
                      breakpoints={{
                        640: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                      }}
                      className="pb-10" // Add padding for pagination
                    >
                      {images.map((image, index) => (
                        <SwiperSlide key={image.preview || index}>
                          <div className="relative group aspect-square">
                            <img
                              loading="lazy"
                              src={image.preview}
                              alt={`Vista previa ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemoveImage(image)}
                              >
                                <X className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
                {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>}
              </div>

              {/* Attachments Upload */}
              <div>
                <Label className="text-lg">Archivos Adjuntos</Label>
                <div {...getAttachmentRootProps()} className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                  <input {...getAttachmentInputProps()} />
                  <div className="space-y-2 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Arrastra y suelta archivos aquí, o haz clic para seleccionar</p>
                     <p className="text-xs text-gray-500 dark:text-gray-500">Cualquier tipo de archivo</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Nota: El tamaño total de todos los archivos subidos (imágenes y adjuntos) no debe exceder los 15 MB.</p>
                {attachments && attachments.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {attachments.map((att, i) => (
                      <div key={att.path || i} className="relative p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-between">
                        <div className="flex items-center">
                          <FileIcon className="h-8 w-8 text-gray-500 mr-2" />
                          <span className="text-sm truncate">{att.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {att.path && (
                            <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${att.path}`} target="_blank" rel="noopener noreferrer">
                              <Button type="button" variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
                          <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveAttachment(att)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.attachments && <p className="text-sm text-red-500 mt-1">{errors.attachments.message}</p>}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting} size="lg">
                  {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Proyecto' : 'Crear Proyecto')}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProjectPostForm;
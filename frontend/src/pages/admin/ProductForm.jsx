import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from '@/utils/axiosConfig';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { XCircle, FileText, Download, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';
import AdminHero from '@/components/admin/AdminHero';

const schema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  description: yup.string().required('La descripción es requerida'),
  price: yup.number().typeError('El precio debe ser un número').positive('El precio debe ser positivo').required('El precio es requerido'),
  category: yup.string().required('La categoría es requerida'),
  stock: yup.number().typeError('El stock debe ser un número').integer('El stock debe ser un entero').min(0, 'El stock no puede ser negativo').required('El stock es requerido'),
  active: yup.boolean().required('El estado de publicación es requerido'),
  images: yup.mixed(),
  pdfs: yup.mixed(),
});

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedPdfs, setDeletedPdfs] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      active: true,
      images: [],
      pdfs: [],
    },
  });

  const stockValue = watch('stock');
  const images = watch('images');
  const pdfs = watch('pdfs');

  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (stockValue !== undefined) {
      setValue('active', stockValue > 0);
    }
  }, [stockValue, setValue]);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`/products/${id}`);
          // Set form values
          setValue('name', data.name);
          setValue('description', data.description);
          setValue('price', data.price);
          setValue('category', data.category);
          setValue('stock', data.stock);
          setValue('active', data.active);

          // Set images
          if (data.images && data.images.length > 0) {
            setValue('images', data.images.map(img => ({
              name: img.split('/').pop(),
              preview: img,
              path: img,
            })));
          }

          // Set PDFs
          if (data.pdfs && data.pdfs.length > 0) {
            setValue('pdfs', data.pdfs.map(pdf => ({
              ...pdf,
              preview: pdf.path,
            })));
          }
        } catch (error) {
          console.error('Error al cargar el producto:', error);
          alert('No se pudo cargar el producto para editar.');
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, setValue]);

  const onImagesDrop = useCallback(acceptedFiles => {
    const currentImages = watch('images') || [];
    const newImages = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setValue('images', [...currentImages, ...newImages], { shouldValidate: true });
  }, [setValue, watch]);

  const onPdfsDrop = useCallback(acceptedFiles => {
    const currentPdfs = watch('pdfs') || [];
    const newPdfs = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setValue('pdfs', [...currentPdfs, ...newPdfs], { shouldValidate: true });
  }, [setValue, watch]);

  const { getRootProps: imageRootProps, getInputProps: imageInputProps } = useDropzone({ onDrop: onImagesDrop, accept: { 'image/*': [] } });
  const { getRootProps: pdfRootProps, getInputProps: pdfInputProps } = useDropzone({ onDrop: onPdfsDrop, accept: { 'application/pdf': ['.pdf'] } });

  const handleRemoveImage = (imageToRemove) => {
    const newImages = images.filter(image => image.preview !== imageToRemove.preview);
    setValue('images', newImages, { shouldValidate: true });
    if (imageToRemove.path) {
      setDeletedImages(prev => [...prev, imageToRemove.path]);
    }
  };

  const handleRemovePdf = (pdfToRemove) => {
    const newPdfs = pdfs.filter(pdf => pdf.preview !== pdfToRemove.preview);
    setValue('pdfs', newPdfs, { shouldValidate: true });
    if (pdfToRemove.path) {
      setDeletedPdfs(prev => [...prev, pdfToRemove.path]);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Append all fields except files
    Object.keys(data).forEach(key => {
      if (key !== 'images' && key !== 'pdfs') {
        formData.append(key, data[key]);
      }
    });

    // Append new images
    const newImages = data.images.filter(img => img instanceof File);
    for (const image of newImages) {
      formData.append('images', image);
    }

    // Append new PDFs
    const newPdfs = data.pdfs.filter(pdf => pdf instanceof File);
    for (const pdf of newPdfs) {
      formData.append('pdf', pdf);
    }

    // Append deleted files info
    if (deletedImages.length > 0) {
      formData.append('deletedImages', JSON.stringify(deletedImages));
    }
    if (deletedPdfs.length > 0) {
      formData.append('deletedPdfs', JSON.stringify(deletedPdfs));
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEditMode) {
        await axios.put(`/products/${id}`, formData, config);
        alert('Producto actualizado con éxito');
      } else {
        await axios.post('/products', formData, config);
        alert('Producto creado con éxito');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert('Ocurrió un error al guardar el producto.');
    }
  };

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Editar Producto' : 'Crear Producto'} - Admin</title>
      </Helmet>

      <AdminHero 
        title={isEditMode ? "Editar <span class='text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300'>Producto</span>" : "Crear <span class='text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300'>Producto</span>"}
        subtitle={isEditMode ? "Modifica los detalles del producto existente." : "Añade un nuevo producto a tu catálogo."}
      />

      <div className="container mx-auto p-4 py-12">
        <div className="mb-8">
            <Button asChild variant="outline">
              <Link to="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la Lista
              </Link>
            </Button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Fields */}
            <div>
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" {...register('name')} />
              <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" {...register('description')} />
              <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} />
                <p className="text-red-500 text-sm mt-1">{errors.price?.message}</p>
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select onValueChange={(value) => setValue('category', value)} value={watch('category') || ''}>
                  <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-red-500 text-sm mt-1">{errors.category?.message}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" {...register('stock')} />
              <p className="text-red-500 text-sm mt-1">{errors.stock?.message}</p>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="active" {...register('active')} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded" />
              <Label htmlFor="active">Publicar Producto (Activo)</Label>
            </div>

            {/* Image Upload */}
            <div>
              <Label>Imágenes del Producto</Label>
              <div {...imageRootProps()} className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <input {...imageInputProps()} />
                <p className="text-gray-700 dark:text-gray-300">Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
              </div>
              {images && images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={image.preview || index} className="relative w-full h-32 rounded-md overflow-hidden shadow-md">
                      <img loading="lazy" src={image.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(image)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PDF Upload */}
            <div>
              <Label>Ficha Técnica (PDF)</Label>
              <div {...pdfRootProps()} className="mt-2 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <input {...pdfInputProps()} />
                <p className="text-gray-700 dark:text-gray-300">Arrastra y suelta archivos PDF aquí, o haz clic para seleccionar</p>
              </div>
              {pdfs && pdfs.length > 0 && (
                <div className="mt-4 space-y-2">
                  {pdfs.map((pdf, index) => (
                    <div key={pdf.preview || index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-6 h-6 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{pdf.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {pdf.path && (
                           <a href={pdf.path} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                            <Download className="w-5 h-5" />
                          </a>
                        )}
                        <button type="button" onClick={() => handleRemovePdf(pdf)} className="text-red-500 hover:text-red-700">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductForm;

import { useState } from 'react';
import axios from 'axios';

const ProductForm = ({ onProductCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [pdfFile, setPdfFile] = useState(null); // New state for PDF file

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('category', category);
      if (pdfFile) {
        formData.append('pdf', pdfFile); // Append the PDF file
      }

      const { data } = await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onProductCreated(data);
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCategory('');
      setPdfFile(null); // Clear PDF file state
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Create Product</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      ></textarea>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      {/* New PDF input field */}
      <div>
        <label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700">
          Upload PDF (Optional)
        </label>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="mt-1 w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full p-2 text-white bg-primary rounded">
        Create
      </button>
    </form>
  );
};

export default ProductForm;
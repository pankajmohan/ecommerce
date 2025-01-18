import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductForm = () => {
  const [name, setname] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [brand, setBrand] = useState('');

  const navigate = useNavigate();
  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty']; // Example categories

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      alert('You can only upload up to 4 images.');
      return;
    }

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...filePreviews]);
    setImages((prev) => [...prev, ...files]);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value.split(','));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !stock || !price || !category || !note || !brand) {
      alert('Please fill out all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('note', note);
    formData.append('stock', stock);
    formData.append('price', price);
    formData.append('discount', discount);
    formData.append('category', category); // Submit category as a string
    formData.append('tags', tags.join(','));
    formData.append('brand', brand);

    images.forEach((image, index) => {
      formData.append(`image_${index + 1}`, image); // Appending images with field names image_1, image_2, etc.
    });

    // Submit formData to the server
    fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Product Submitted Successfully');
        navigate('/ecommerce'); 
        // setname('');
        // setDescription('');
        // setNote('');
        // setStock('');
        // setPrice('');
        // setDiscount('');
        // setCategory('');
        // setTags([]);
        // setImages([]);
        // setBrand('');
        // setPreviewImages([]);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to submit product. Please try again.');
      });
  };

  const removePreview = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-6xl mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Add Product</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium mb-1">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Enter product brand"
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Enter product name"
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter additional notes"
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter product stock"
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter product price"
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Discount</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Enter discount"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Tags</label>
          <input
            type="text"
            value={tags.join(',')}
            onChange={handleTagsChange}
            placeholder="Enter tags (comma separated)"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div className="col-span-full">
          <label className="block font-medium mb-1">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full"
          />
          <div className="flex space-x-2 mt-2">
            {previewImages.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Image Preview ${index + 1}`} className="w-20 h-20 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-lg mt-4"
      >
        Submit Product
      </button>
    </form>
  );
};

export default ProductForm;

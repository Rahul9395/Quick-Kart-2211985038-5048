import React, { useState } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import { toast } from 'react-toastify';

function AddProduct() {
  const { allCategory, AddProduct, uploadImageToCloudinary } = useAdmin();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');

  const [images, setImages] = useState([{ file: null, url: '', public_id: '' }]);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);

  const handleImageChange = async (index, file) => {
    const newImages = [...images];
    try {
      const { imageUrl, public_id } = await uploadImageToCloudinary(file);
      newImages[index] = { file, url: imageUrl, public_id };
      setImages(newImages);
    } catch (err) {
      toast.error('Image upload failed!');
    }
  };

  const addImageField = () => {
    setImages([...images, { file: null, url: '', public_id: '' }]);
  };

  const removeImageField = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpecField = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpecField = (index) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !brand || !price || !category || images.length === 0) {
      return toast.error('Please fill all required fields!');
    }

    const uploadedImages = images
      .filter((img) => img.url)
      .map(({ url, public_id }) => ({ url, public_id }));

    const productData = {
      name,
      brand,
      description,
      rating,
      price,
      category,
      discount,
      stock,
      images: uploadedImages,
      specs,
    };

    const success = await AddProduct(productData);
    if (success) {
      toast.success('Product added successfully!');
      setName('');
      setBrand('');
      setPrice('');
      setCategory('');
      setDiscount('');
      setStock('');
      setDescription('');
      setRating('');
      setImages([{ file: null, url: '', public_id: '' }]);
      setSpecs([{ key: '', value: '' }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block font-semibold mb-1">Product Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full p-3 border border-gray-300 rounded-md" placeholder="e.g., iPhone 14" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Brand</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required
            className="w-full p-3 border border-gray-300 rounded-md" placeholder="e.g., Apple" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter detailed product description"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Initial Rating (0 to 5)</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0"
            max="5"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="e.g., 4.5"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required
              className="w-full p-3 border border-gray-300 rounded-md" placeholder="e.g., 79999" />
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-1">Discount (%)</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" placeholder="e.g., 10" />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md" placeholder="e.g., 50" />
          </div>

          <div className="flex-1">
            <label className="block font-semibold mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required
              className="w-full p-3 border border-gray-300 rounded-md">
              <option value="">Select Category</option>
              {allCategory.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2">Product Images</label>
          {images.map((img, index) => (
            <div key={index} className="flex items-center gap-4 mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files[0])}
                className="border p-2 rounded-md"
              />
              {img.url && (
                <img src={img.url} alt="preview" className="h-20 w-20 object-cover rounded-md border" />
              )}
              {index > 0 && (
                <button type="button" onClick={() => removeImageField(index)} className="text-red-500">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImageField}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            + Add Image
          </button>
        </div>

        <div>
          <label className="block font-semibold mb-2">Specifications</label>
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" placeholder="Key (e.g., RAM)" value={spec.key}
                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                className="p-2 border rounded-md flex-1" />
              <input type="text" placeholder="Value (e.g., 8GB)" value={spec.value}
                onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                className="p-2 border rounded-md flex-1" />
              <button type="button" onClick={() => removeSpecField(index)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addSpecField}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            + Add Specification
          </button>
        </div>

        <button type="submit"
          className="w-full bg-black text-white py-3 rounded-md text-lg hover:bg-gray-800">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;

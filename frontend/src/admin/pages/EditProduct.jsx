import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../Context/AdminContext';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getProductById,
    currentProduct,
    updateProduct,
    loading,
  } = useAdmin();

  const [formData, setFormData] = useState({
    description: '',
    price: '',
    discount: '',
    stock: '',
    specs: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!currentProduct || currentProduct._id !== id) {
        await getProductById(id);
      } else {
        setFormData({
          description: currentProduct.description || '',
          price: currentProduct.price || '',
          discount: currentProduct.discount || '',
          stock: currentProduct.stock || '',
          specs: currentProduct.specs || [],
        });
      }
    };
    fetchData();
  }, [id, currentProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specs];
    updatedSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }],
    }));
  };

  const handleDeleteSpec = (index) => {
    const updatedSpecs = formData.specs.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProduct(id, formData);
    if (success) navigate('/admin/view-product');
  };

  if (loading || !currentProduct) {
    return <div className="p-4 text-center">Loading product data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

      <div className="mb-6 space-y-2 text-gray-700">
        <p><strong>Product Name:</strong> {currentProduct.name}</p>
        <p><strong>Brand:</strong> {currentProduct.brand}</p>
        <p><strong>Category:</strong> {currentProduct.category?.name || 'N/A'}</p>
        <div>
          <strong>Images:</strong>
          <div className="flex gap-2 mt-1">
            {currentProduct.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`product-img-${i}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Discount"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Specifications</label>
          {formData.specs.map((spec, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                placeholder="Key"
                className="border p-2 rounded w-1/2"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                placeholder="Value"
                className="border p-2 rounded w-1/2"
              />
              <button
                type="button"
                onClick={() => handleDeleteSpec(index)}
                className="text-red-600 font-bold"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSpec}
            className="text-blue-600 font-semibold mt-2"
          >
            + Add Spec
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProduct;

import React, { useState } from 'react';
import {toast} from 'react-toastify';
import { useAdmin } from '../../Context/AdminContext';

function AddCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [public_id,setPublic_id]= useState('');

  const {uploadImageToCloudinary, AddCategory}=useAdmin();

const handleImageChange = async (event) => {
  const file = event.target.files[0];

  if (!file) {
    setImage(null);
    setImageUrl('');
    setPublic_id('');
    toast.warning("No image selected.");
    return;
  }

  setImage(file);
  toast.info("Uploading image...");

  const uploadResult = await uploadImageToCloudinary(file);

  if (uploadResult) {
    setImageUrl(uploadResult.imageUrl);
    setPublic_id(uploadResult.public_id);
    toast.success("Image uploaded successfully!");
  } else {
    setImageUrl('');
    setPublic_id('');
    toast.error("Image upload failed. Please try again.");
  }
};

 const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !description || !imageUrl) {
      toast.warning("Please fill in all fields and upload an image.");
      return;
    }

    const formData = {
      name,
      description,
      imageUrl,
      public_id,
    };

    const success = await AddCategory(formData);

    if (success) {
      toast.success("Category added successfully!");
      setName('');
      setDescription('');
      setImage(null);
      setImageUrl('');
      setPublic_id('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-sans">
      <div className="max-w-xl w-full"> {/* Increased max-width for a more spread-out feel */}
        <h2 className="text-5xl font-extrabold text-gray-800 mb-10 text-center leading-tight">Add New Product Category</h2> {/* Larger, more impactful title */}

        <form onSubmit={handleSubmit} className="space-y-8"> {/* Increased spacing between sections */}
          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200"> {/* Section card */}
            <label htmlFor="image-upload" className="block text-xl font-semibold text-gray-800 mb-4">Upload Category Image</label>
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="image-upload" 
                className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition duration-300 ease-in-out text-blue-700"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-lg"><span className="font-bold">Click to upload</span> or drag and drop</p>
                    <p className="text-sm">JPG, PNG, GIF, or SVG (Max 5MB)</p>
                  </div>
                )}
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
              </label>
            </div>
          </div>
          
          {/* Category Name */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200"> {/* Section card */}
            <label htmlFor="category-name" className="block text-xl font-semibold text-gray-800 mb-4">Category Name</label>
            <input
              type="text"
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-4 text-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="e.g., Electronics, Fashion, Home Goods"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200"> {/* Section card */}
            <label htmlFor="description" className="block text-xl font-semibold text-gray-800 mb-4">Category Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-4 text-lg focus:ring-blue-500 focus:border-blue-500 min-h-[150px] resize-y transition duration-200"
              placeholder="Provide a detailed description of the category, including its scope and typical products."
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 transform hover:-translate-y-1 shadow-lg text-xl"
          >
            Create New Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;
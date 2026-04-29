import React, { useState } from 'react';
import { useUser } from '../../Context/UserContext';
import { useAdmin } from '../../Context/AdminContext';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';

function AdminHome() {
  const { user } = useUser();
  const {posters, setPosters, addPoster, deletePoster}= useAdmin();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const {uploadImageToCloudinary}=useAdmin();
  const [newPoster, setNewPoster] = useState({
    imageUrl: '',
    title: '',
    offer: '',
    description: '',
    public_id:''
  });



const handleDelete = async (_id, public_id) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This poster will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    const success = await deletePoster(_id, public_id);

    if (success) {
      setPosters(prev => prev.filter(poster => poster._id !== _id));
      toast.success("Poster deleted successfully.");
    } else {
      toast.error("Failed to delete poster.");
    }

  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Something went wrong.");
  }
};



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPoster({ ...newPoster, [name]: value });
  };

 const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const uploadResult = await uploadImageToCloudinary(file);
    if (uploadResult) {
      setNewPoster({ ...newPoster, imageUrl: uploadResult.imageUrl, public_id: uploadResult.public_id, });
    }
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await addPoster(newPoster);

  if (success) {
    toast.success("Poster added successfully!");
    setNewPoster({ imageUrl: '', title: '', offer: '', description: '' });
  } else {
    toast.error("Failed to add poster.");
  }
};


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 mt-12 md:mt-0">
        Welcome to <span className="text-primary-600">QuickKart</span> Admin Panel
        {user && (
          <span className="block text-lg font-medium text-gray-600 mt-1">
            Hello, {user.name}
          </span>
        )}
      </h1>

      <p className="text-gray-600 mb-8">
        This is where you can manage promotional posters for your QuickKart store.
      </p>

      {/* Poster Management Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Current Posters</h2>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            {showUploadForm ? 'Cancel Upload' : 'Upload New Poster'}
          </button>
        </div>

        {/* Upload Poster Form */}
        {showUploadForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upload New Poster</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {newPoster.imageUrl && (
                  <img src={newPoster.imageUrl} alt="Preview" className="mt-4 max-h-48 rounded-md shadow-md" />
                )}
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newPoster.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Grand Festive Sale"
                  required
                />
              </div>
              <div>
                <label htmlFor="offer" className="block text-sm font-medium text-gray-700 mb-1">
                  Offer
                </label>
                <input
                  type="text"
                  id="offer"
                  name="offer"
                  value={newPoster.offer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Flat 30% Off!"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newPoster.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide a detailed description of the offer..."
                  required
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Add Poster
            </button>
          </form>
        )}

        {/* Display Posters */}
        {posters?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posters.map((poster) => (
              <div key={poster._id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out">
                <img
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{poster.title}</h3>
                  <p className="text-primary-600 font-semibold mb-2">{poster.offer}</p>
                  <p className="text-gray-600 text-sm mb-4">{poster.description}</p>
                  <button
                    onClick={() => handleDelete(poster._id,poster.public_id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    Delete Poster
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg py-10">No posters available. Upload a new one!</p>
        )}
      </div>
    </div>
  );
}

export default AdminHome;
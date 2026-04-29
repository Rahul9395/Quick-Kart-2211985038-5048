import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import { Trash2, Search } from 'lucide-react';
import Swal from 'sweetalert2';

function ViewCategory() {
  const { allCategory, deleteCategory } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
  if (!searchTerm.trim()) {
    setFiltered(allCategory || []);
  } else {
    const lowerSearch = searchTerm.toLowerCase();
    setFiltered(
      (allCategory || []).filter((cat) =>
        cat.name.toLowerCase().includes(lowerSearch) ||
        cat.slug.toLowerCase().includes(lowerSearch)
      )
    );
  }
}, [searchTerm, allCategory]);



const handleDelete = async (_id, public_id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This will permanently delete the category.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    deleteCategory(_id, public_id);
  }
};



  return (
    <div className="p-4 pt-10 max-w-screen-xl mx-auto">
      {/* Page Heading */}
      <h1 className="text-2xl font-bold mb-6 text-center">All Categories</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search category..."
            className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Categories Grid */}
      {filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{cat.name}</h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {cat.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(cat._id, cat.public_id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No categories found.</p>
      )}
    </div>
  );
}

export default ViewCategory;

import React from 'react';
import { useAdmin } from '../../Context/AdminContext';
import SearchProduct from '../component/SearchProduct';
import { Link } from 'react-router-dom';
import ProductCard from '../component/ProductCard';
import Swal from 'sweetalert2';

function ViewProductByCategory() {
  const {
    fetchAllProducts,
    allProducts,
    setCurrentProductPage,
    currProductPage,
    totalPages,
    deleteProduct,
  } = useAdmin();



const handleDelete = async (_id, public_id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This will permanently delete the product and its image.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    await deleteProduct(_id, public_id); // Assuming this handles backend + Cloudinary delete
    fetchAllProducts(currProductPage);   // Refresh product list
    Swal.fire('Deleted!', 'Product has been deleted.', 'success');
  }
};



  const handlePageChange = (page) => {
    setCurrentProductPage(page);
    sessionStorage.setItem('currProductPage', page);
    fetchAllProducts(page);
  };

  return (
    <div className="p-4 space-y-4">
      <SearchProduct />


      <div className="grid grid-cols-1 gap-6 ">
        {allProducts.length === 0 ? (
          <div className="col-span-full flex items-center justify-center min-h-[200px]">
            <p className="text-gray-600 text-lg font-medium">Loading ...</p>
          </div>
        ) : (
          allProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>



      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currProductPage - 1)}
            disabled={currProductPage <= 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${currProductPage === i + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currProductPage + 1)}
            disabled={currProductPage >= totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewProductByCategory;

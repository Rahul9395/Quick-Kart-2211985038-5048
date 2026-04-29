import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../Context/AdminContext';
import ProductCard from '../component/ProductCard';
import Swal from 'sweetalert2';

function ViewProduct() {
  const { id } = useParams();
 
  const {
    getProductById,
    currentProduct,
    navigate,
    loading,
    deleteProduct
  } = useAdmin();

  useEffect(() => {
    let ignore = false;

    const fetchProduct = async () => {
      if (id && (!currentProduct || currentProduct._id !== id)) {
        await getProductById(id);
      }
    };

    if (!ignore) {
      fetchProduct();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

 const handleDelete = async (productId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This will permanently delete the product.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    const success = await deleteProduct(productId);
    if (success) {
      Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      navigate('/admin/view-product');
    } else {
      Swal.fire('Error', 'Failed to delete product.', 'error');
    }
  }
};

  if (loading || !currentProduct) {
    return <div className="p-4 text-center">Loading product details...</div>;
  }

  if (currentProduct._id !== id) {
    return <div className="p-4 text-center">Product not found.</div>;
  }

  return (
    <div className="p-4">
      <p
        onClick={() => navigate(-1)}
        className="cursor-pointer text-blue-600 hover:underline mb-4"
      >
        ← Back
      </p>
      <ProductCard
        key={currentProduct._id}
        product={currentProduct}
        onDelete={() => handleDelete(currentProduct._id)}
      />
    </div>
  );
}

export default ViewProduct;

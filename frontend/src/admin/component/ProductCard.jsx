import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product, onDelete }) {
  const discountedPrice = Math.round(product.price - (product.price * product.discount) / 100);
  const hasReviews = product.reviews && product.reviews.length > 0;


  return (
    <div className="w-full border border-gray-200 rounded-2xl overflow-hidden shadow-lg bg-white mb-8 transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] md:overflow-auto" >
      <div className="md:flex md:items-center">
        {/* Product Image Gallery Section */}
        <div className="md:flex-shrink-0 p-6 md:p-8 flex flex-col items-center">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-64 object-contain rounded-lg shadow-md mb-4 md:w-64 md:h-64 border border-gray-100 p-2 bg-gray-50"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg shadow-md mb-4 md:w-64 md:h-64 border border-gray-100">
              <span className="text-gray-400 text-lg font-medium">No Image Available</span>
            </div>
          )}
          {product.images && product.images.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center max-w-full">
              {product.images.slice(1, 5).map((img, index) => ( // Show up to 4 smaller images
                <img
                  key={index}
                  src={img.url}
                  alt={`Thumbnail ${index + 2}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-200 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
              {product.images.length > 5 && (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-xs border border-gray-200 shadow-sm">
                  +{product.images.length - 5} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Details and Actions Section */}
        <div className="p-6 md:p-8 flex-grow">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">{product.name}</h2>
          <p className="text-md text-gray-700 mb-2">
            <span className="font-semibold">Brand:</span> {product.brand}
          </p>
          <p className="text-md text-gray-700 mb-3">
            <span className="font-semibold">Category:</span> {product.category?.name || 'Uncategorized'}
          </p>

          <div className="flex items-baseline mb-4 flex-wrap gap-x-4">
            <span className="text-4xl font-bold text-red-700">₹{discountedPrice}</span>
            <span className="ml-2 line-through text-gray-500 text-xl">₹{product.price}</span>
            {product.discount > 0 && (
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-lg font-semibold">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-700 mb-4">
            <span className="font-semibold mr-2">In Stock:</span>
            {product.stock > 0 ? (
              <span className="text-green-600 font-bold">{product.stock} units</span>
            ) : (
              <span className="text-red-600 font-bold">Out of Stock</span>
            )}
            <span className="ml-6 font-semibold mr-2">Overall Rating:</span>
            <span className="text-yellow-500 font-bold text-lg">{product.rating}</span>
            {hasReviews && <span className="text-gray-500 ml-1">({product.reviews.length} reviews)</span>}
          </div>

          {/* Specifications Section */}
          {product.specs?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="font-bold text-lg text-gray-800 mb-3">Product Specifications:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm text-gray-700">
                {product.specs.map((spec, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="font-semibold mr-1 text-gray-800">{spec.key}:</span> {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews Summary (optional: for detailed reviews, link to product page) */}
          {hasReviews && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="font-bold text-lg text-gray-800 mb-3">Recent Reviews:</p>
              <ul className="text-sm text-gray-700 max-h-28 overflow-y-auto custom-scrollbar pr-3">
                {product.reviews.slice(0, 3).map((review, idx) => ( // Show top 3 reviews
                  <li key={idx} className="mb-2 p-2 bg-gray-50 rounded-md border border-gray-100">
                    <strong className="text-blue-700">{review.name}:</strong> <span className="text-yellow-600">{review.rating}★</span> - "{review.comment}"
                  </li>
                ))}
                {product.reviews.length > 3 && (
                  <li className="text-blue-600 text-sm mt-2 text-right">
                    <Link to={`/product/${product._id}#reviews`} className="hover:underline">View all {product.reviews.length} reviews &rarr;</Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <Link
              to={`/admin/edit-product/${product._id}`}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
              Edit Product
            </Link>
            <button
              onClick={() => onDelete(product._id)}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
import React from 'react'
import { Link } from 'react-router-dom'; // Import Link for dynamic routing

function SmallProductCart({ product}) {
    return (
        <Link
            to={`/product/${product._id}`}  
            key={product._id}
            className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden"
        >
            <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden relative">
                <img
                    src={product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/250?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discount}%
                    </span>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                    {product.name}
                </h3>
                <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-bold text-blue-600">
                        ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            ₹{product.price.toFixed(2)}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600 mt-2">Brand: {product.brand}</p>
            </div>
        </Link>
    )
}

export default SmallProductCart

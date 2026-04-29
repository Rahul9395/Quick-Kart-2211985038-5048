import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'


import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  Check,
  MapPin,
  Clock,
  Award,
  Package,
} from 'lucide-react';
import { useUser } from '../Context/UserContext';

function LargeProductCart() {
  const { Id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const { url, isFavorite, setIsFavorite, addToCart, removeFromCart, cartItemCount, setCartItemCount, user } = useUser();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${url}/api/users/products/get-product/${Id}`);

        let reviews = data?.product?.reviews;
        if (!reviews || reviews.length === 0) {
          reviews = [
            {
              name: "Rajesh Kumar",
              rating: 5,
              comment: "Excellent product! The build quality is outstanding and it works exactly as described. Very happy with my purchase.",
              date: "2024-01-15"
            },
            {
              name: "Priya Sharma",
              rating: 4,
              comment: "Good value for money. The product arrived quickly and was well-packaged. Minor issue with the initial setup but customer service was helpful.",
              date: "2024-01-10"
            },
            {
              name: "Amit Patel",
              rating: 5,
              comment: "Amazing quality! This has exceeded my expectations. The design is sleek and it's very user-friendly. Highly recommend!",
              date: "2024-01-08"
            }
          ];
        }

        const productWithReviews = {
          ...data.product,
          reviews,
          numReviews: reviews.length
        };

        setProduct(productWithReviews);
        setSuggestions(data?.suggestions || []);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (Id) {
      fetchProduct();
    }
  }, [Id, url]);


  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < (product?.stock || 0)) {
      setQuantity((prev) => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setShowShareModal(true);
      setTimeout(() => setShowShareModal(false), 3000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * discount) / 100);
  };

  const calculateSavings = (price, discount) => {
    return Math.round((price * discount) / 100);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating)
          ? 'fill-yellow-400 text-yellow-400'
          : index < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
          }`}
      />
    ));
  };

  const handleAddToCart = async (getProductById, cartQuantity) => {
    try {
      setButtonLoading(true);

      const response = await addToCart(getProductById, cartQuantity);
      if (response) {
        setCartItemCount((prevCount) => prevCount + 1);
        toast.success('Product added to cart successfully!');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error('Failed to add product to cart.');
    } finally {
      setButtonLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
  const savings = calculateSavings(product.price, product.discount);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <span>Home</span> / <span>{product.category?.name}</span> / <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-lg overflow-hidden group">
                <img
                  src={product.images[currentImageIndex]?.url || 'https://via.placeholder.com/500?text=No+Image'}
                  alt={product.name}
                  className="w-full h-96 md:h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={img.public_id || index}
                    onClick={() => handleImageChange(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImageIndex
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-200 ${isFavorite
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                  <span>{isFavorite ? 'Wishlisted' : 'Wishlist'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                </div>

                <p className="text-gray-600 mb-2">by <span className="text-blue-600 font-medium">{product.brand}</span></p>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({product.numReviews} reviews)</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">₹{discountedPrice.toLocaleString()}</span>
                  <span className="text-lg line-through text-gray-500">₹{product.price.toLocaleString()}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                    {product.discount}% OFF
                  </span>
                </div>
                <p className="text-green-600 font-medium">You save ₹{savings.toLocaleString()}</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  disabled={product.stock === 0 || buttonLoading}
                  onClick={() => handleAddToCart(product._id, quantity)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg 
             hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {buttonLoading ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
                

              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Free Delivery</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <RotateCcw className="w-5 h-5 text-orange-600" />
                  <span className="text-sm">Easy Returns</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Warranty</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Deliver to: <strong>{
                   user && user.address ? `${user.address.houseName}, ${user.address.city}` : 'Unknown Location'
                  }</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Get it by <strong>Tomorrow</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Product Description</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description || 'No description available for this product.'}
              </p>
            </div>
          </div>
        </div>

        {/* Product Specifications Section */}
        <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1 h-8 bg-green-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">Specifications</h2>
            </div>
            {product.specs && product.specs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.specs.map((spec, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-semibold text-gray-800">{spec.key}</span>
                      </div>
                      <span className="text-gray-900 font-medium bg-white px-3 py-1 rounded-lg shadow-sm">
                        {spec.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No specifications available for this product.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
  <div className="p-4 sm:p-6 lg:p-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="w-1 h-6 sm:h-8 bg-yellow-500 rounded-full"></div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Reviews</h2>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
        <div className="flex items-center space-x-1">{renderStars(product.rating)}</div>
        <span className="text-base sm:text-lg font-semibold text-gray-900">{product.rating}</span>
        <span className="text-gray-500 text-sm sm:text-base">({product.numReviews} reviews)</span>
      </div>
    </div>

    {product.reviews && product.reviews.length > 0 ? (
      <div className="space-y-4 sm:space-y-6">
        {product.reviews.map((review, index) => (
          <div key={index} className="group">
            <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg">{review.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                      <span className="text-xs sm:text-sm font-medium text-gray-600">{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                {review.date && (
                  <div className="text-left sm:text-right">
                    <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                      {new Date(review.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4 sm:pl-16">
                "{review.comment}"
              </p>

              {/* Review Actions */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 sm:pl-16 pt-3 sm:pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors group">
                  <span className="text-base group-hover:scale-110 transition-transform">👍</span>
                  <span className="font-medium">Helpful</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {Math.floor(Math.random() * 20) + 5}
                  </span>
                </button>
                <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
                  Reply
                </button>
                <button className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium">
                  Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12 sm:py-16">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Star className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500 mb-4 sm:mb-6 text-base sm:text-lg">
          Be the first to share your experience with this product!
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Write the First Review
        </button>
      </div>
    )}
  </div>
</div>

      </div>

      <div className="suggestions-container mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col bg-white"
            >
              {/* Product Image */}
              <Link to={`/product/${product._id}`} className="block rounded-lg overflow-hidden">
                <div className="relative w-full h-48 bg-gray-100">
                  <img
                    src={product.images?.[0]?.url || "/images/placeholder.png"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="mt-4 flex-grow flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-blue-600 font-bold text-base">
                    ₹{calculateDiscountedPrice(product.price, product.discount)}{' '}
                    <del className="text-gray-500 font-normal">₹{product.price}</del>
                  </span>
                  {product.discount && (
                    <span className="text-green-600 text-sm font-medium">{product.discount}% off</span>
                  )}
                </div>
              </div>

              {/* View Button */}
              <Link
                to={`/product/${product._id}`}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md text-center transition-colors duration-200"
              >
                View Product
              </Link>
            </div>
          ))}
        </div>
      </div>



      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span>Link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}

export default LargeProductCart;
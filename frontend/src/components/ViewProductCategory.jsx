import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { toast } from 'react-toastify';
import SmallProductCart from './SmallProductCart';
import axios from 'axios';

function ViewProductCategory() {
  const { slug } = useParams();
  const { url } = useUser();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // 'asc' or 'desc'

  const fetchProductsByCategory = async (slug) => {
    try {
      const { data } = await axios.get(`${url}/api/users/products/get-products-by-category/${slug}`);
      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
        return true;
      }
    } catch (err) {
      console.error("Failed to fetch products by category:", err.message);
      return false;
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProductsByCategory(slug).then(success => {
        if (!success) {
          toast.error(`Failed to fetch products for category: ${slug}`);
        }
      });
    }
  }, [slug]);

  useEffect(() => {
    let tempProducts = [...products];

    // Apply price filtering
    if (minPrice !== '') {
      tempProducts = tempProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      tempProducts = tempProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Sort by price
    if (sortOrder === 'asc') {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      tempProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(tempProducts);
  }, [minPrice, maxPrice, sortOrder, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 capitalize">
        Products in {slug} Category
      </h2>

      {/* Filter section */}
      <div className="bg-gray-100 p-4 rounded-md mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex gap-2 items-center">
          <label className="text-gray-700">Min Price:</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded px-2 py-1 w-24"
            placeholder="0"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-gray-700">Max Price:</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded px-2 py-1 w-24"
            placeholder="1000"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-gray-700">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">None</option>
            <option value="asc">Price Low → High</option>
            <option value="desc">Price High → Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <SmallProductCart key={product._id || product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-16">
          <p className="text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default ViewProductCategory;

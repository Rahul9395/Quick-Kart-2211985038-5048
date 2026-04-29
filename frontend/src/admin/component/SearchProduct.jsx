import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../Context/AdminContext';
import { Search } from 'lucide-react';

const SearchProduct = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const { fetchSuggestions, suggestions, setSuggestions, navigate } = useAdmin();

  const wrapperRef = useRef();

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsFetching(true);
        await fetchSuggestions(searchQuery);
        setIsFetching(false);
      } else {
        setSuggestions([]);
      }
    }, 500); 

    return () => clearTimeout(delay);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSuggestions]);

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setSearchQuery('');
    setSuggestions([]);
    navigate(`/admin/product/${product._id}`);
  };

  return (
    <div className="relative inline-block w-full max-w-md" ref={wrapperRef}>
      {/* 🔍 Search icon */}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />

      {/* 🔤 Input field */}
      <input
        type="text"
        placeholder="Search product by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
      />

      {/* 🔽 Suggestions */}
      {searchQuery && (
        <div className="absolute w-full mt-1 z-50">
          {isFetching ? (
            <div className="bg-white border shadow rounded w-full p-2">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="bg-white border shadow max-h-60 overflow-auto rounded w-full">
              {suggestions.map((product) => (
                <li
                  key={product._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleSelect(product)}
                >
                  <img
                    src={product.images?.[0]?.url || '/default.jpg'}
                    alt={product.name || 'product'}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <span>{product.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            searchQuery.trim() && (
              <div className="bg-white border shadow rounded w-full p-2">
                <p className="text-gray-500">No products found</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;

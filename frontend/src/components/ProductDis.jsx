import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import { ArrowUpNarrowWide, ArrowDownWideNarrow, SortAsc, SortDesc } from 'lucide-react';
import SmallProductCart from './SmallProductCart';

function ProductDis() {
  const {
    products,
    currPage,
    setCurrPage,
    totalPages,
    fetchProducts
  } = useUser();

  const [sortOrder, setSortOrder] = useState('default');
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    let sorted = [...products];
    if (sortOrder === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    setDisplayedProducts(sorted);
  }, [products, sortOrder]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrPage(page);
      fetchProducts(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    const maxPagesToShow = 5;
    const pageNumbers = [];
    let startPage = Math.max(1, currPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white text-gray-700 p-8">
        <p>Loading products or no products available...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gradient-to-br from-sky-50 to-indigo-100 min-h-screen">
      
      {/* Sort Dropdown */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
        <div className="relative">
          <label htmlFor="sort-by" className="sr-only">Sort by</label>
          <select
            id="sort-by"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Default Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500">
            {sortOrder === 'price-asc' && <ArrowUpNarrowWide size={18} />}
            {sortOrder === 'price-desc' && <ArrowDownWideNarrow size={18} />}
            {sortOrder === 'name-asc' && <SortAsc size={18} />}
            {sortOrder === 'name-desc' && <SortDesc size={18} />}
            {sortOrder === 'default' && <SortAsc size={18} />}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayedProducts.map((product) => (
          <SmallProductCart key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => handlePageChange(currPage - 1)}
            disabled={currPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {renderPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md transition ${
                currPage === page
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-blue-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currPage + 1)}
            disabled={currPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDis;

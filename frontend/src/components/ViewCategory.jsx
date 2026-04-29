import React, { useRef, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; 

function ViewCategory() {
  const { categorys } = useUser(); // Categories from context
  const scrollContainerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categorys.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div
      id="categories"
      className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden"
    >

      {/* Search Box */}
      <div className="max-w-7xl mx-auto mb-6 px-4 sm:px-0 relative z-10">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Category Scroll Section */}
      <div className="relative z-10">
        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-20
            hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
            transform -translate-x-1/2 md:-translate-x-1/4"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 px-12 md:px-16 py-2 overflow-x-scroll scrollbar-hide snap-x snap-mandatory scroll-smooth"
        >
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <Link to={`/category/${category.slug}`} key={category.slug}>
                <div
                  className="flex-shrink-0 w-48 md:w-56 lg:w-64 bg-white rounded-lg shadow-md p-4
                    flex flex-col items-center justify-center text-center
                    snap-center transform hover:scale-105 transition-transform duration-200 ease-in-out"
              >
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-32 md:h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-800 truncate w-full px-2">
                  {category.name}
                </h3>
              </div>
              </Link>
            ))
          ) : (
            <div className="flex-shrink-0 w-full text-center text-gray-600 py-10 px-12 md:px-16">
              No categories found.
            </div>
          )}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-20
            hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
            transform translate-x-1/2 md:translate-x-1/4"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

export default ViewCategory;

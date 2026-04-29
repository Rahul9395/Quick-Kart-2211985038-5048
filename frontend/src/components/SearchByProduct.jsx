import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const SearchByProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const { getSearchResults, searchResults, setSearchResults } = useUser();
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsFetching(true);
        const ok = await getSearchResults(searchQuery);
        setIsFetching(false);
        if (!ok) setSearchResults([]);
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    // pointerdown works for mouse + touch
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  const pick = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    // clear first, then navigate programmatically
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/product/${id}`);
  };

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg z-[999]" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search product by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          className="w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {searchQuery && (
        <div className="absolute left-0 w-full mt-1 z-50">
          {isFetching ? (
            <div className="bg-white border shadow rounded-md p-3 text-sm text-gray-500">Loading...</div>
          ) : searchResults.length > 0 ? (
            <ul className="bg-white border shadow rounded-md max-h-60 overflow-y-auto">
              {searchResults.map((p) => (
                <li key={p._id}>
                  <button
                    type="button"
                    onPointerDown={(e) => pick(p._id, e)}
                    className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={p.images?.[0]?.url || "/default.jpg"}
                      alt={p.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <span className="text-sm truncate">{p.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-white border shadow rounded-md p-3 text-sm text-gray-500">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchByProduct;

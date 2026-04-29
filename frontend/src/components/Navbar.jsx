import React, { useState, useEffect, useRef } from 'react';
import { User, Menu, X, ShoppingCart, Heart, Search } from 'lucide-react';
import { HashRouter as Router, Link, useLocation } from 'react-router-dom';
import logo from '../assets/frontend/logo1.png';
import { useUser } from '../Context/UserContext';
import SearchByProduct from './SearchByProduct';
import AccountMenu from './AccountMenu';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const searchRef = useRef(null);

  const { token, user, cartItemCount } = useUser();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    setIsOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
    setIsMobileSearchOpen(false);
  };

  return (
    <div className="relative">
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50'
            : 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-md shadow-lg'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-2 group"
                onClick={handleLinkClick}
              >
                {/* Logo */}
                <img
                  src={logo}
                  alt="E-commerce Logo"
                  className="h-10 w-auto lg:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = logo;
                  }}
                />
              </Link>
            </div>

            {/* Desktop Search - Hidden on Mobile */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="w-full">
                <SearchByProduct />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              
              {/* Navigation Links */}
              <div className="flex items-center space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/contact"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/contact'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Contact
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname.includes('/admin')
                        ? 'bg-red-100 text-red-700 shadow-sm'
                        : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </div>

              {/* Auth Section */}
              {token ? (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  
                  {/* Mobile Search Icon - Only visible on tablet */}
                  <button
                    onClick={toggleMobileSearch}
                    className="lg:hidden p-2.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    <Search size={18} />
                  </button>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className="relative group p-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    onClick={handleLinkClick}
                  >
                    <ShoppingCart size={20} className="transition-transform duration-200 group-hover:scale-110" />
                    {cartItemCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ring-2 ring-white shadow-lg animate-pulse">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </div>
                    )}
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className="group p-2.5 rounded-lg bg-gradient-to-r from-pink-50 to-red-50 text-red-500 hover:from-pink-100 hover:to-red-100 hover:text-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    onClick={handleLinkClick}
                  >
                    <Heart size={20} className="transition-transform duration-200 group-hover:scale-110" />
                  </Link>

                  {/* Account Menu */}
                  <div className="relative">
                    <AccountMenu />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  
                  {/* Mobile Search Icon */}
                  <button
                    onClick={toggleMobileSearch}
                    className="lg:hidden p-2.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    <Search size={18} />
                  </button>

                  {/* Auth Buttons */}
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    onClick={handleLinkClick}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleLinkClick}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions Bar */}
            <div className="flex items-center space-x-2 md:hidden">
              
              {/* Mobile Search Icon */}
              <button
                onClick={toggleMobileSearch}
                className={`p-2.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  isMobileSearchOpen 
                    ? 'bg-blue-100 text-blue-700 shadow-md ring-2 ring-blue-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 shadow-sm hover:shadow-md'
                }`}
                aria-label="Toggle search"
              >
                <Search size={20} className="transition-transform duration-200" />
              </button>

              {/* Mobile Cart Icon - Only show when user is logged in */}
              {token && (
                <Link
                  to="/cart"
                  className="relative group p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  onClick={handleLinkClick}
                  aria-label={`Shopping cart with ${cartItemCount} items`}
                >
                  <ShoppingCart size={20} className="transition-transform duration-200 group-hover:scale-110" />
                  {cartItemCount > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white shadow-lg animate-pulse">
                      <span className="text-[10px]">
                        {cartItemCount > 9 ? '9+' : cartItemCount}
                      </span>
                    </div>
                  )}
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className={` p-2.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  isOpen 
                    ? 'bg-red-100 text-red-700 shadow-md ring-2 ring-red-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 shadow-sm hover:shadow-md'
                }`}
                aria-label="Toggle mobile menu"
              >
                <div className="relative w-6 h-6 ">
                  <Menu
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
                    }`}
                  />
                  <X
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <div
          className={`lg:hidden fixed top-16 lg:top-20 left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-gray-200/80 shadow-2xl transition-all duration-400 ease-out z-50 ${
            isMobileSearchOpen
              ? 'opacity-100 translate-y-0 visibility-visible'
              : 'opacity-0 -translate-y-6 pointer-events-none visibility-hidden'
          }`}
        >
          <div className="container mx-auto px-4 py-5" ref={searchRef}>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-1">
                <SearchByProduct />
              </div>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden fixed top-16 lg:top-20 left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-gray-200/80 shadow-2xl transition-all duration-400 ease-out z-50 ${
            isOpen
              ? 'opacity-100 translate-y-0 visibility-visible'
              : 'opacity-0 -translate-y-6 pointer-events-none visibility-hidden'
          }`}
        >
          <div className="container mx-auto px-4 py-6">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 mb-6">
              <Link
                to="/"
                className={`block px-5 py-4 rounded-2xl text-base font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  location.pathname === '/'
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md border border-blue-200/50'
                    : 'text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm bg-white/60'
                }`}
                onClick={handleLinkClick}
              >
                <div className="flex items-center justify-between">
                  <span>Home</span>
                  {location.pathname === '/' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </Link>

              <Link
                to="/contact"
                className={`block px-5 py-4 rounded-2xl text-base font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  location.pathname === '/contact'
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md border border-blue-200/50'
                    : 'text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm bg-white/60'
                }`}
                onClick={handleLinkClick}
              >
                <div className="flex items-center justify-between">
                  <span>Contact</span>
                  {location.pathname === '/contact' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className={`block px-5 py-4 rounded-2xl text-base font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                    location.pathname.includes('/admin')
                      ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-md border border-red-200/50'
                      : 'text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 hover:shadow-sm bg-white/60'
                  }`}
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center justify-between">
                    <span>Admin Dashboard</span>
                    {location.pathname.includes('/admin') && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile User Section */}
            {token ? (
              <div className="space-y-4 pt-6 border-t border-gray-200/60">
                
                {/* Cart - Mobile */}
                <Link
                  to="/cart"
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50/80 to-blue-100/80 rounded-2xl border border-blue-200/50 hover:from-blue-100/80 hover:to-blue-200/80 transition-all duration-300 group transform hover:scale-[1.02] shadow-sm hover:shadow-md"
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-lg">
                      <ShoppingCart size={22} className="text-white" />
                    </div>
                    <div>
                      <span className="text-base font-semibold text-gray-800">Shopping Cart</span>
                      <p className="text-sm text-gray-600">
                        {cartItemCount > 0 ? `${cartItemCount} items in cart` : 'Your cart is empty'}
                      </p>
                    </div>
                  </div>
                  {cartItemCount > 0 && (
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-full h-10 w-10 flex items-center justify-center shadow-lg ring-2 ring-white">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </div>
                  )}
                </Link>

                {/* Wishlist - Mobile */}
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-4 p-5 bg-gradient-to-r from-pink-50/80 to-red-50/80 rounded-2xl border border-pink-200/50 hover:from-pink-100/80 hover:to-red-100/80 transition-all duration-300 group transform hover:scale-[1.02] shadow-sm hover:shadow-md"
                  onClick={handleLinkClick}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300 shadow-lg">
                    <Heart size={22} className="text-white" />
                  </div>
                  <div>
                    <span className="text-base font-semibold text-gray-800">Wishlist</span>
                    <p className="text-sm text-gray-600">Your saved items</p>
                  </div>
                </Link>

                {/* Account - Mobile */}
                <div className="p-5 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 rounded-2xl border border-purple-200/50 shadow-sm">
                  <AccountMenu />
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200/60">
                <Link
                  to="/login"
                  className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 text-center rounded-2xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                  onClick={handleLinkClick}
                >
                  Login to Your Account
                </Link>
                <Link
                  to="/register"
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center rounded-2xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  onClick={handleLinkClick}
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="h-16 lg:h-20"></div>

      {/* Overlay for mobile menu */}
      {(isOpen || isMobileSearchOpen) && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-all duration-400"
          onClick={() => {
            setIsOpen(false);
            setIsMobileSearchOpen(false);
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default Navbar;
import React, { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';

function Page404() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 4000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    navigate('/')
  };

  if (!showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl text-gray-500 animate-pulse">Loading . . .</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white text-gray-800 p-6">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 md:p-14 text-center max-w-lg w-full transition-transform duration-500 hover:scale-[1.02]">
        <div className="mb-6">
          <h1 className="text-6xl font-extrabold text-purple-600 animate-bounce">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
            Oops! Page not found.
          </h2>
        </div>

        <p className="text-gray-500 text-md md:text-lg mb-8 leading-relaxed">
          The page you're looking for doesn’t exist or has been moved. Let’s get you back on track.
        </p>

        <button
          onClick={handleGoBack}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Page404;

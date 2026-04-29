import React, { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import headerBackground from "../assets/frontend/hb.jpg"; 

function PosterSlider() {
  const { AllPoster } = useUser();
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false); 

  // Auto-change posters every 4 seconds
  useEffect(() => {
    if (AllPoster && AllPoster.length > 0) {
      const interval = setInterval(() => {
        setTransitioning(true); // Start transition out
        setTimeout(() => {
          setCurrentPosterIndex(prev => (prev + 1) % AllPoster.length);
          setTransitioning(false); // End transition in after new content is set
        }, 500); 
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [AllPoster]);

  //Debug log
  // useEffect(() => {
  //   console.log("AllPoster changed:", AllPoster);
  // }, [AllPoster]);

  if (!AllPoster || AllPoster.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 text-white">
        Loading posters or no posters available...
      </div>
    );
  }

  const currentPoster = AllPoster[currentPosterIndex];

  return (
    <header
      className="relative w-full min-h-[400px] flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${headerBackground})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Content container - Adjusted for larger image and smooth transition */}
      <div
        className={`relative z-10 flex flex-col md:flex-row items-center justify-around w-[90%] max-w-6xl mx-auto p-5 rounded-lg 
                    transition-all duration-500 ease-in-out transform
                    ${transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        {/* Left: Image - Made larger */}
        <div className="flex-1 flex justify-center p-4 md:pr-8 mb-6 md:mb-0">
          <img
            src={currentPoster.imageUrl} // ✅ Assuming 'imageUrl' is the correct key for the image URL
            alt={currentPoster.title}
            className="w-full max-w-sm md:max-w-md h-auto rounded-lg shadow-2xl object-contain max-h-[350px] md:max-h-[450px]"
          />
        </div>

        {/* Right: Text - Background removed from this specific div */}
        <div className="flex-1 p-4 md:pl-8 text-center md:text-left text-white text-shadow-lg">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-5 leading-tight">
            {currentPoster.title}
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-4 md:mb-6">
            {currentPoster.description}
          </p>
          {currentPoster.offer && (
            <p className="text-xl md:text-2xl font-bold text-yellow-400">
              {currentPoster.offer}
            </p>
          )}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {AllPoster.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
              index === currentPosterIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => setCurrentPosterIndex(index)}
          ></span>
        ))}
      </div>
    </header>
  );
}

export default PosterSlider;
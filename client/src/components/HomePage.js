import React, { useState, useRef, useEffect } from 'react';
import ProductList from './ProductList';

function MainContent() {
  const [hoveredImageIndices, setHoveredImageIndices] = useState({});
  const intervalIdsRef = useRef({}); // Store interval IDs here

  // Start carousel when mouse enters a product card
  const handleMouseEnter = (productId, imageCount) => {
    if (!intervalIdsRef.current[productId]) {
      const intervalId = setInterval(() => {
        setHoveredImageIndices((prev) => ({
          ...prev,
          [productId]: (prev[productId] + 1) % imageCount, // Cycle images
        }));
      }, 1000); // Change every 500ms

      intervalIdsRef.current[productId] = intervalId;
      setHoveredImageIndices((prev) => ({ ...prev, [productId]: 0 })); // Initialize to first image
    }
  };

  // Stop carousel when mouse leaves a product card
  const handleMouseLeave = (productId) => {
    clearInterval(intervalIdsRef.current[productId]);
    delete intervalIdsRef.current[productId]; // Remove interval reference
    setHoveredImageIndices((prev) => ({ ...prev, [productId]: 0 })); // Reset to first image
  };

  // Cleanup intervals when component unmounts to avoid memory leaks
  useEffect(() => {
    return () => {
      // Clear all active intervals when the component unmounts
      Object.values(intervalIdsRef.current).forEach(clearInterval);
      intervalIdsRef.current = {}; // Reset interval references
    };
  }, []);

  return (
    <div className="flex flex-col h-screen"> {/* Full screen height */}
      {/* Static Header or any content you want to stay fixed */}
      {/* Main Content that should scroll */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="w-full">
          <ProductList
            onHoverStart={handleMouseEnter}
            onHoverEnd={handleMouseLeave}
            hoveredImageIndices={hoveredImageIndices}
          />
        </div>
      </main>

      {/* Static Footer or any content you want to stay fixed */}
    </div>
  );
}

export default MainContent;

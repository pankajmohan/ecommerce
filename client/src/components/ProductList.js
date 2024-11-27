import React from 'react';
import ProductCard from './ProductCard';
import image1 from './images/cover image.jpeg';
import image2 from './images/coverimage2.png';
import image3 from './images/coverimage3.png';
import image4 from './images/coverimage4.png';

let images = [image1, image2, image3]
const random = Math.floor(Math.random() * images.length)
const ProductList = ({ onHoverStart, onHoverEnd, hoveredImageIndices }) => {
  const products = [
   { id: 1, name: 'Wireless Headphones', description: 'High-quality sound with noise cancellation.', price: 99.99, images: [image1, image2, image3] },
    { id: 2, name: 'Smart Watch', description: 'Track your fitness and notifications.', price: 199.99, images: [image3, image1, image2] },
    { id: 3, name: 'Bluetooth Speaker', description: 'Portable speaker with bass boost.', price: 49.99, images: [image4, image2] },
    { id: 4, name: '4K TV', description: 'Ultra HD display with smart features.', price: 599.99, images: [image1, image2, image3] },
    { id: 5, name: 'Laptop', description: 'High-performance laptop with the latest CPU.', price: 999.99, images: [image4, image2, image3] },
    { id: 6, name: 'Smartphone', description: 'Latest smartphone with an amazing camera.', price: 799.99, images: [image1, image4] },
    { id: 7, name: 'Camera', description: 'High-resolution camera with advanced features.', price: 449.99, images: [image4, image2, image3] },
    { id: 8, name: 'Headphones', description: 'Noise-canceling over-ear headphones.', price: 129.99, images: [image1, image2, image3] },
    { id: 9, name: 'Fitness Tracker', description: 'Track your health and fitness progress.', price: 69.99, images: [image1, image2, image4] },
    { id: 10, name: 'Smart Bulbs', description: 'Smart lighting with color options.', price: 39.99, images: [image1, image3] },
    { id: 11, name: 'Portable Charger', description: 'Compact power bank for charging on the go.', price: 29.99, images: [image1, image3] },
    { id: 12, name: 'Electric Toothbrush', description: 'Advanced electric toothbrush with multiple modes.', price: 59.99, images: [image1, image2, image3] },
    { id: 13, name: 'Smart Thermostat', description: 'Control your home temperature remotely.', price: 149.99, images: [image1, image3] },
    { id: 14, name: 'VR Headset', description: 'Immersive VR experience for gaming and entertainment.', price: 299.99, images: [ image2, image3] },
    { id: 15, name: 'Drone', description: '4K camera drone with long battery life.', price: 499.99, images: [image1, image2, image3] },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
          currentImageIndex={hoveredImageIndices[product.id] || 0}
        />
      ))}
    </div>
  );
};

export default ProductList;

import React from 'react';
import ProductCard from './ProductCard';
import image1 from './images/cover image.jpeg';
import image2 from './images/coverimage2.png';
import image3 from './images/coverimage3.png';
import image4 from './images/coverimage4.png';

const ProductList = ({ onHoverStart, onHoverEnd, hoveredImageIndices }) => {
  const products = [
   { id: 1, name: 'Wireless Headphones', description: 'High-quality sound with noise cancellation.', price: 99.99, images: [image1, image2, image3] },
    { id: 2, name: 'Smart Watch', description: 'Track your fitness and notifications.', price: 199.99, images: [image3, image1, image2] },
    { id: 3, name: 'Bluetooth Speaker', description: 'Portable speaker with bass boost.', price: 49.99, images: [image4, image2] },
    { id: 4, name: '4K TV', description: 'Ultra HD display with smart features.', price: 599.99, images: [image1, image2, image3] },
    { id: 5, name: 'Laptop', description: 'High-performance laptop with the latest CPU.', price: 999.99, images: [image4, image2, image3] },
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

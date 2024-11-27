import React from 'react';

const ProductCard = ({ product, onHoverStart, onHoverEnd, currentImageIndex }) => {
  return (
    <div
      className="flex flex-col bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
      onMouseEnter={() => onHoverStart(product.id, product.images.length)}
      onMouseLeave={() => onHoverEnd(product.id)}
      style={{
        width: '100%',
        maxWidth: '18rem',
      }}
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full object-cover rounded-t-lg"
          style={{
            height: '12rem', // Adjust this to match your desired image height
          }}
        />
        
        {/* Dots for Carousel */}
        <div className="absolute bottom-2 w-full flex justify-center gap-1">
          {product.images.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentImageIndex
                  ? 'bg-indigo-500'
                  : 'bg-gray-300'
              } transition-all`}
            />
          ))}
        </div>
      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-1 p-3">
        {/* Product Name */}
        <h3 className="text-sm md:text-base font-semibold text-gray-800"
        style={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
          {product.name}
        </h3>

        {/* Product Description */}
        <p
          className="text-xs text-gray-500 mt-1 line-clamp-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="mt-auto text-center">
          <span className="block text-sm font-bold text-green-600">
            ${product.price}
          </span>
          <button className="px-3 py-2 mt-2 w-full bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import React from 'react';

const ProductCard = ({ product, onHoverStart, onHoverEnd, currentImageIndex }) => {
  return (
    <div
      className="max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto rounded-lg border border-indigo-200 bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col"
      onMouseEnter={() => onHoverStart(product.id, product.images.length)}
      onMouseLeave={() => onHoverEnd(product.id)}
    >
      {/* Product Image */}
      <img
        src={product.images[currentImageIndex]}
        alt={product.name}
        className="h-48 sm:h-52 md:h-60 lg:h-64 w-full object-cover rounded-t-lg"
      />

      <div className="flex-1 p-4">
        {/* Product Name */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          {product.name}
        </h3>

        {/* Product Description */}
        <p
          className="text-gray-500 text-sm sm:text-base md:text-lg mt-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3, // Number of lines to show
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>

        {/* Price */}
        {/* <div className="flex items-center justify-between mt-4">
          
        </div> */}
      </div>

      {/* Add to Cart Button */}
      <div className='text-center'>   <span className="text-xl sm:text-2xl font-bold text-green-600">
            ${product.price}
          </span>     
      <button className="px-4 py-2 sm:px-5 sm:py-3 bg-gray-50 text-indigp text-sm sm:text-base font-medium rounded-b-lg w-full hover:bg-indigo-500 hover:text-white transition-colors">
        Add to Cart
      </button>
      </div>
    </div>
  );
};

export default ProductCard;

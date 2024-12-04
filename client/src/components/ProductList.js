import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ onHoverStart, onHoverEnd, hoveredImageIndices }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={{
            id: product.product_id,
            name: product.product_name,
            description: product.note,
            price: product.price,
            images: product.images,
          }}
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
          currentImageIndex={hoveredImageIndices[product.product_id] || 0}
        />
      ))}
    </div>
  );
};

export default ProductList;

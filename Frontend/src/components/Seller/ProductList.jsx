import React, { useEffect, useState } from "react";
import ProductCard from './ProductCard.jsx';

const ProductList = ({ products, categories, onProductRemoved, onProductCategoryUpdated }) => {
    return (
        <div className="container">
            <h2 className="h2 text-center">Product List</h2>
            <div className="row g-3">
                {products.map(product => (
                    <ProductCard 
                        key={product.product_id} 
                        product={product}
                        categories={categories}
                        onProductRemoved={onProductRemoved}
                        onProductCategoryUpdated={onProductCategoryUpdated}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
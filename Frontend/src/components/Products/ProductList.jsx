import React, { useEffect, useState } from 'react';
import { publicFetch } from '../../services/PublicFetch.jsx';
import ProductCard from './ProductCard.jsx';

const ProductList = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await publicFetch({ URL: '/products/all' });
            if (data) {
                setProducts(data);
                console.log(data)
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container">
            <h1>Product List</h1>
            <ul>
                {products.map(product => (
                    <div className="col-md-4" key={product.product_id}>
                        <ProductCard 
                            productImgURL={product.product_ImgUrl} // Ensure correct property name
                            productName={product.product_name} 
                            productPrice={product.product_price}
                        />
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
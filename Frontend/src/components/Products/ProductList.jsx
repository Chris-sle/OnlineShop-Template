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
        <div className="container bg-dark-subtle">
            <h1 className='h1 text-center'>Product List</h1>
            <div className="row">
                
                    {products.map(product => (
                        <div className="col col-4" key={product.product_id}>
                            <ProductCard
                                productImgURL={product.product_ImgUrl} // Ensure correct property name
                                productName={product.product_name}
                                productPrice={product.product_price}
                            />
                        </div>
                    ))}
                
            </div>
        </div>
    );
};

export default ProductList;
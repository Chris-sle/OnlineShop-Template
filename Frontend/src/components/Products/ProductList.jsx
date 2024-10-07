import React, { useEffect, useState } from 'react';
import { publicFetch } from '../../services/PublicFetch.jsx';
import ProductCard from './ProductCard.jsx';

const ProductList = ({ categoryId, loading, setLoading}) => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
   
    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryId) {
                return;
            }

            setLoading(true);
            try {
                const url = categoryId === 'all' 
                    ? '/products/all' 
                    : `/categories/${categoryId}/products`;
                    
                const data = await publicFetch({ URL: url, method: 'GET' });
                setProducts(data);
                
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setError('Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, setLoading]);

    if (error) return <p>{error}</p>;
    if (loading) return <p>Loading products . . .</p>

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.length > 0 ? (
                products.map(product => (
                    <div key={product.product_id} className='col'>
                        <ProductCard product={product} />
                    </div>
                ))
            ):(
                <div className='col'>
                    <p className='p'>No products available for this category</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;
import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../services/fetchWithToken';
import { publicFetch } from '../services/PublicFetch';
import ProductList from '../components/Seller/ProductList';
import AddProduct from '../components/Seller/AddProduct';


const SellerPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    fetchWithToken('/seller/products', 'GET'),
                    publicFetch({ URL: '/categories/', method: 'GET' }),
                ]);
                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error('failed to fetch data:', error);
                setError('failed to load data.')
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleProductAdded = (newProduct) => {
        // Ensure that you are directly using the new product data
        setProducts(prevProducts => [{ ...newProduct }, ...prevProducts]); // Add new product to front of the list
    };

    const handleProductRemoved = (productId) => {
        setProducts(prevProducts => prevProducts.filter(product => product.product_id !== productId));
    };

    const handleProductCategoryUpdated = (productId, categoryId) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.product_id === productId ? { ...product, category_id: categoryId } : product
            )
        );
    };

    if (loading) return <p>Loading. . .</p>
    if (error) return <p>{error}</p>

    return (
        <main className='container mt-4'>
            <h1 className='h1 text-center'>Seller Dashboard</h1>
            <AddProduct
                categories={categories}
                onProductAdded={handleProductAdded}
            />
            <ProductList
                products={products}
                onProductRemoved={handleProductRemoved}
                onProductCategoryUpdated={handleProductCategoryUpdated}
                categories={categories}
            />
        </main>
    );
};

export default SellerPage;
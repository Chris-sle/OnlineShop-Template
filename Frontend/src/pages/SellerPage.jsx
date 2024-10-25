import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../services/fetchWithToken';
import { publicFetch } from '../services/PublicFetch';
import ProductList from '../components/Seller/ProductList';
import AddProduct from '../components/Seller/AddProduct';
import SellerOrders from '../components/Seller/SellerOrders';

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
                setError('failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleProductAdded = (newProduct) => {
        setProducts(prevProducts => [{ ...newProduct }, ...prevProducts]);
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

    if (loading) return <p>Loading. . .</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className='container mb-2'>
            <h1 className='h1 text-center'>Seller Dashboard</h1>

            <div className="mb-3">
                <button className="btn btn-primary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#addProductCollapse" aria-expanded="false" aria-controls="addProductCollapse">
                    Toggle Add Product
                </button>
                <div className="collapse" id="addProductCollapse">
                    <AddProduct
                        categories={categories}
                        onProductAdded={handleProductAdded}
                    />
                </div>
            </div>

            <div className="mb-3">
                <button className="btn btn-primary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#productListCollapse" aria-expanded="false" aria-controls="productListCollapse">
                    Toggle Product List
                </button>
                <div className="collapse" id="productListCollapse">
                    <ProductList
                        products={products}
                        onProductRemoved={handleProductRemoved}
                        onProductCategoryUpdated={handleProductCategoryUpdated}
                        categories={categories}
                    />
                </div>
            </div>

            <div className="mb-3">
                <button className="btn btn-primary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#sellerOrdersCollapse" aria-expanded="false" aria-controls="sellerOrdersCollapse">
                    Toggle Seller Orders
                </button>
                <div className="collapse" id="sellerOrdersCollapse">
                    <SellerOrders />
                </div>
            </div>
        </main>
    );
};

export default SellerPage;
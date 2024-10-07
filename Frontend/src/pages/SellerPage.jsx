import React from 'react';
import ProductList from '../components/Seller/ProductList';
import AddProduct from '../components/Seller/AddProduct';


const SellerPage = () => {

    const handleProductAdded = () => {
        // logic to refresh product list or use state management
    };

    return (
        <main className='container d-flex justify-content-center'>
            <div className='row '>
                <h1>Seller Dashboard</h1>
            </div>
            <div className='row'>
            <ProductList />
            <AddProduct onProductAdded={handleProductAdded} />
            </div>
        </main>
    );
};

export default SellerPage;
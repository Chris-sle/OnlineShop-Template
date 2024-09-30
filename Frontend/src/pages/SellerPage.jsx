import React from 'react';
import ProductList from '../components/Seller/ProductList';
import AddProduct from '../components/Seller/AddProduct';


const SellerPage = () => {

    const handleProductAdded = () => {
        // logic to refresh product list or use state management
    };

    return (
        <div>
            <h1>Seller Dashboard</h1>
            <ProductList />
            <AddProduct onProductAdded={handleProductAdded} />
        </div>
    );
};

export default SellerPage;
import React, { useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';

const AddProduct = ({ onProductAdded }) => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImgUrl, setProductImgUrl] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchWithToken('/seller/products', 'POST', {
                product_name: productName,
                product_description: productDescription,
                product_price: Number(productPrice),
                product_ImgUrl: productImgUrl,
            });
            onProductAdded(); // Refresh product list
            setProductName('');
            setProductDescription('');
            setProductPrice('');
            setProductImgUrl('');
        } catch (error) {
            setError('Failed to add product.');
        }
    };

    return (
        <div className='container'>
            <h2 className='h2'>Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-float'>
                    <input
                        className='form-control'
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Product Name"
                        required
                    />
                    <textarea
                        className='form-control'
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Product Description"
                        required
                    />
                    <input
                        className='form-control'
                        type="text"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="Product Price"
                        required
                    />
                    <input
                        type="text"
                        value={productImgUrl}
                        onChange={(e) => setProductImgUrl(e.target.value)}
                        placeholder="Image URL"
                        required
                    />
                </div>
                <button className="btn btn-primary" type="submit">Add Product</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default AddProduct;
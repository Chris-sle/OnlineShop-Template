import React, { useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';

const AddProduct = ({ onProductAdded, categories }) => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productImgUrl, setProductImgUrl] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newProduct = await fetchWithToken('/seller/products', 'POST', {
                product_name: productName,
                product_description: productDescription,
                product_price: Number(productPrice),
                product_ImgUrl: productImgUrl,
                category_id: categoryId,
            });
            if (newProduct) {
                onProductAdded(newProduct); // Use the returned newProduct
            }
            setProductName('');
            setProductDescription('');
            setProductPrice('');
            setProductImgUrl('');
            setCategoryId(categories[0]?.category_id || '');
        } catch (error) {
            console.error('Failed to add product.', error);
        }
    };

    return (
        <div className='container'>
            <h2 className='h2 text-center'>Add New Product</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-floating mb-3'>
                    <input
                        className='form-control'
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Product Name"
                        required
                    />
                    <label>Product Name</label>
                </div>
                <div className='form-floating mb-3'>
                    <textarea
                        className='form-control'
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Product Description"
                        required
                        style={{ height: '100px' }}
                    />
                    <label>Product Description</label>
                </div>
                <div className='form-floating mb-3'>
                    <input
                        className='form-control'
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="Product Price"
                        required
                    />
                    <label>Product Price</label>
                </div>
                <div className='form-floating mb-3'>
                    <input
                        className='form-control'
                        type="text"
                        value={productImgUrl}
                        onChange={(e) => setProductImgUrl(e.target.value)}
                        placeholder="Image URL"
                        required
                    />
                    <label>Image URL</label>
                </div>
                <div className='form-floating mb-3'>
                    <select
                        className='form-select'
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        {categories.map(category => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.category_name}
                            </option>
                        ))}
                        
                    </select>
                    <label>Select Category</label>
                </div>
                <button className="btn btn-primary w-100" type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
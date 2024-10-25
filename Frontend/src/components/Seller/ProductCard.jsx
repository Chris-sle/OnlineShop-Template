import React, { useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import EditProductForm from './EditProductForm';

const ProductCard = ({ product, categories, onProductRemoved, onProductCategoryUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [productName, setProductName] = useState(product.product_name);
    const [productDescription, setProductDescription] = useState(product.product_description);
    const [productPrice, setProductPrice] = useState(product.product_price);
    const [productImgUrl, setProductImgUrl] = useState(product.product_ImgUrl);
    const [categoryId, setCategoryId] = useState(product.category_id);

    const handleRemove = async () => {
        if (window.confirm('Are you sure you want to remove this product?')) {
            try {
                await fetchWithToken(`/seller/products/${product.product_id}`, 'DELETE');
                onProductRemoved(product.product_id);
            } catch (error) {
                console.error('Failed to remove product:', error.message);
            }
        }
    };

    const updateCategory = async (categoryId) => {
        try {
            await fetchWithToken(`/seller/products/${product.product_id}/category`, 'PUT', { category_id: categoryId });
            onProductCategoryUpdated(product.product_id, categoryId);
        } catch (error) {
            console.error('Failed to update category:', error.message);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetchWithToken(`/seller/products/${product.product_id}`, 'PUT', {
                product_name: productName,
                product_description: productDescription,
                product_price: Number(productPrice),
                product_ImgUrl: productImgUrl,
                category_id: categoryId,
            });
    
            setIsEditing(false); // Exit editing mode after submission
        } catch (error) {
            console.error('Failed to update product:', error.message);
        }
    };
    
    return (
        <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="card h-100">
                <div className={`card h-100 ${isEditing ? 'border-primary' : ''}`} style={{ transition: '0.3s' }}>
                    <div className="card-body">
                        <h5 className="card-title text-center">{product.product_name}</h5>
                        <p className="card-text text-center">{product.product_description}</p>
                        <p className="card-text"><strong>Price: </strong>${product.product_price}</p>

                        {isEditing ? (
                            <EditProductForm
                                productName={productName}
                                setProductName={setProductName}
                                productDescription={productDescription}
                                setProductDescription={setProductDescription}
                                productPrice={productPrice}
                                setProductPrice={setProductPrice}
                                productImgUrl={productImgUrl}
                                setProductImgUrl={setProductImgUrl}
                                categoryId={categoryId}
                                setCategoryId={setCategoryId}
                                categories={categories}
                                handleEditSubmit={handleEditSubmit}
                                cancelEdit={() => setIsEditing(false)} // Function to cancel editing
                            />
                        ) : (
                            <>
                                <select
                                    className="form-select mb-2"
                                    value={product.category_id}
                                    onChange={(e) => updateCategory(e.target.value)}
                                >
                                    {categories.map(category => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                                <button className="btn btn-danger" onClick={handleRemove}>Remove</button>
                                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
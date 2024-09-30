import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../../services/fetchWithToken";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await fetchWithToken('/seller/products', 'GET');
                setProducts(result);
            } catch (error) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const removeProduct = async (productId) => {
        if (window.confirm('Are you sure you want to remove this product?')) {
            try {
                await fetchWithToken(`/seller/products/${productId}`, 'DELETE')
                setProducts(products.filter(product => product.product_id !== productId))
            } catch (error) {
                console.error('Failed to remove product: ', error.message);
                setError('Failed to remove product');
            }
        }
    };

    if (loading) return <p>Loading products . . .</p>
    if (error) return <p>{error}</p>

    return (
        <div className="container">
            <div className="">
                <h2 className="h2">Product List</h2>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.product_id}>
                            <td>{product.product_name}</td>
                            <td>{product.product_description}</td>
                            <td>{product.product_price}</td>
                            <td>
                                <button onClick={() => removeProduct(product.product_id)}>Remove</button>
                                {/* Optionally include an Edit button here */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default ProductList;
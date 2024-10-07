import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { publicFetch } from '../../services/PublicFetch';
import { AuthContext } from '../../context/AuthContext';
import ProductReviews from './ProductReviews';
import AddReview from './AddReview';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productData = await publicFetch({ URL: `/products/${productId}`, method: 'GET' });

                if (Array.isArray(productData) && productData.length > 0) {
                    setProduct(productData[0]); // Access the first item in the array
                }

                const reviewsData = await publicFetch({ URL: `/products/${productId}/reviews`, method: 'GET' });
                setReviews(reviewsData);
            } catch (error) {
                console.error('Failed to fetch product or reviews:', error);
                setError('Failed to load product details.');
            }
        };

        fetchProductDetails();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const reviewsData = await publicFetch({ URL: `/products/${productId}/reviews`, method: 'GET' });
            setReviews(reviewsData);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            setError('Failed to load reviews.');
        }
    };

    if (error) return <p>{error}</p>
    if (!product) return <p>Loading product details...</p>;

    return (
        <main className='container mt-4'>
            <div className='row'>
                <div className='col-md-6'>
                    <img src={product.product_ImgUrl} alt={product.product_name} className="img-fluid" />
                </div>
                <div className='col-md-6'>
                    <h1>{product.product_name}</h1>
                    <p>{product.product_description}</p>
                    <p><strong>Price:</strong> ${parseFloat(product.product_price).toFixed(2)}</p>
                    <button className="btn btn-primary mb-3">Add to cart</button>


                </div>
                <div className='col-md-6 justify-content-center'>
                    <ProductReviews productId={productId} reviews={reviews} />
                    {token && <AddReview productId={productId} onReviewAdded={fetchReviews} />}
                </div>
            </div>
        </main>
    );
};

export default ProductDetail;
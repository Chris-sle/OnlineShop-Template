import react, { useEffect, useState } from 'react';
import { publicFetch } from '../../services/PublicFetch';

const ProductReviews = ({ reviews }) => {
    

    return (
        <div className="container mt-4">
            <h3 className="h3">Reviews</h3>
            {reviews.length > 0 ? (
                <ul className="list-group">
                    {reviews.map(review => (
                        <li key={review.review_id} className="list-group-item">
                            <strong>{review.rating} Stars</strong> - {review.comment} 
                            <br />
                            <small className="text-muted">by {review.user_email} on {new Date(review.createdAt).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews available for this product yet.</p> // Message for no reviews
            )}
        </div>
    )
};

export default ProductReviews
import React, { useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken.jsx';

const AddReview = ({ productId, onReviewAdded  }) => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(1);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(`Submitting review for product: /products/${productId}/reviews`); // Debugging line
            await fetchWithToken(`/products/${productId}/reviews`, 'POST', { rating, comment });
            setMessage('Review submitted successfully!');
            setComment('');
            setRating(1);
            onReviewAdded();
        } catch (error) {
            console.error('Failed to submit review:', error);
            setMessage('Failed to submit review.');
        }
    };

    return (
        <div className="mt-4">
            <h4>Write a Review</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Rating: </label>
                    <select className="form-select d-inline w-auto ms-2" value={rating} onChange={(e) => setRating(e.target.value)}>
                        {[...Array(5)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-success">Submit Review</button>
                {message && <p className="mt-2">{message}</p>}
            </form>
        </div>
    );
};

export default AddReview;
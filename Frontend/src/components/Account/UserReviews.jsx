import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';

const UserReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const data = await fetchWithToken('/users/reviews', 'GET');
                setReviews(data);
            } catch (error) {
                setError('Failed to fetch reviews.')
            } finally {
                setLoading(false)
            }
        };

        fetchUserReviews();
    }, []);

    if (loading) return <p>Loading user reviews...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='container mt-3'>
            <h2 className='h2 text-center'>Your Reviews</h2>
            {reviews.length === 0 ? <p>No reviews found</p> : (
                <ul className='list-group'>
                    {reviews.map(review => (
                        <li key={review.review_id} className='list-group-item'>
                            <h3>{review.product_name}</h3>
                            <p><strong>{review.title}</strong> - {review.comment}</p>
                            <p>Rating: {review.rating} / 5</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
};

export default UserReviews;
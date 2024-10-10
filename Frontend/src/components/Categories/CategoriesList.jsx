import React, { useEffect, useState } from 'react';
import { publicFetch } from '../../services/PublicFetch';

const ProductCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await publicFetch({ URL: '/categories/', method: 'GET' });
                setCategories(data);
            } catch (error) {
                setError('Failed to fetch categories.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <p>Loading categories...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>Categories</h3>
            <ul>
                {categories.map(category => (
                    <li key={category.category_id}>
                        {category.category_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductCategories;

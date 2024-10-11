import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../../services/fetchWithToken';
import { publicFetch } from '../../services/PublicFetch';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await publicFetch({ URL: '/categories/', method: 'GET' });
                setCategories(result);
            } catch (error) {
                setError('Failed to fetch categories.');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const addCategory = async () => {
        if (!newCategoryName) return;
        try {
            await fetchWithToken('/admin/categories', 'POST', { categoryName: newCategoryName });
            const updatedCategories = await publicFetch({ URL: '/categories', method: 'GET' });
            setCategories(updatedCategories);
            setNewCategoryName('');
        } catch (error) {
            console.error('Failed to add category:', error.message);
            setError('Failed to add category');
        }
    };

    const removeCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to remove this category?')) {
            try {
                await fetchWithToken(`/admin/categories/${categoryId}`, 'DELETE');
                const updatedCategories = await publicFetch({ URL: '/categories', method: 'GET' });
                setCategories(updatedCategories);
            } catch (error) {
                console.error('Failed to remove category:', error.message);
                setError('Failed to remove category');
            }
        }
    };

    if (loading) return <p>Loading categories...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="h2 text-center">Category List</h2>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New Category Name"
                    required
                />
                <button className="btn btn-primary mt-2" onClick={addCategory}>Add Category</button>
            </div>
            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category.category_id} className="list-group-item d-flex justify-content-between align-items-center">
                        {category.category_name}
                        <button className="btn btn-danger" onClick={() => removeCategory(category.category_id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
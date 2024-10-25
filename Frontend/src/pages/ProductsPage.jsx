import React, { useEffect, useState} from 'react';
import { publicFetch } from '../services/PublicFetch.jsx'
import CategoryFilter from '../components/Categories/CategoryFilter.jsx';
import ProductList from '../components/Products/ProductList.jsx'

const ProductsPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await publicFetch({ URL: '/categories/', method: 'GET' });
                
                // Check data integrity
                if (data.length > 0) {
                    const allOption = { category_id: 'all', category_name: 'All' };
                    setCategories([allOption, ...data]);
                    setSelectedCategory(allOption.category_id); // Set to 'All'
                } else {
                    console.warn('No categories found')
                }
            } catch (error) {
                setError('Failed to fetch categories.');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (newCategory) => {
        setSelectedCategory(newCategory);
    };

    if (error) return <p>{error}</p>;

    return (
        <main className='container mb-2'>
            <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />
            <ProductList 
                categoryId={selectedCategory}
                loading={loading}
                setLoading={setLoading}
            />
        </main>
    );
};

export default ProductsPage;
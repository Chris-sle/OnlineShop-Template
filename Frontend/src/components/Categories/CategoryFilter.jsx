import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
    return(
        <div className="my-4">
            <label htmlFor="category" className="form-label">Filter by Category:</label>
            <select  
                id="category"
                className="form-select"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
            >
                {categories.map(category => (
                    <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryFilter;
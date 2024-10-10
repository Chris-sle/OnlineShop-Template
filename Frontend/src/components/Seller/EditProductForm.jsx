import React from 'react';

const EditProductForm = ({
    productName,
    setProductName,
    productDescription,
    setProductDescription,
    productPrice,
    setProductPrice,
    productImgUrl,
    setProductImgUrl,
    categoryId,
    setCategoryId,
    categories,
    handleEditSubmit,
    cancelEdit
}) => {
    return (
        <form onSubmit={handleEditSubmit}>
            <input
                type="text"
                className="form-control mb-2"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product Name"
                required
            />
            <textarea
                className="form-control mb-2"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Product Description"
                required
                style={{ height: '100px' }}
            />
            <input
                type="number"
                className="form-control mb-2"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Product Price"
                required
            />
            <input
                type="text"
                className="form-control mb-2"
                value={productImgUrl}
                onChange={(e) => setProductImgUrl(e.target.value)}
                placeholder="Product Image URL"
                required
            />
            <select
                className="form-select mb-2"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
            >
                {categories.map(category => (
                    <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                    </option>
                ))}
            </select>
            <button type="submit" className="btn btn-success mb-2">Save</button>
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
        </form>
    );
};

export default EditProductForm;
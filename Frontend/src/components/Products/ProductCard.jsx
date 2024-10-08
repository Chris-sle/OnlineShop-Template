import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    

    return (
        <div className="card h-100">
            <img src={product.product_ImgUrl} alt={product.product_name} className='card-img-top' />
            <div className='card-body'>
                <h5 className="card-title">{product.product_name}</h5>
                <p className="card-text">{product.product_description}</p>
                <p className='card-text font-weight-bold'>Price: {product.product_price}$</p>
                <div className='container justify-content-center'>
                    <Link to={`/product/${product.product_id}`} className="btn btn-primary">
                        View Product
                    </Link>
                    <button className='btn btn-primary bg-danger-subtle'>
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    )
};

export default ProductCard;
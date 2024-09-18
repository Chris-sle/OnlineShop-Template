import React from 'react';
import PropTypes from 'prop-types';

const ProductCard = (prop) => {

    return (
        <div className="card">
            <img src={prop.productImgURL} alt="Product image" className='card-img-top' />
            <div className='card-body'>

                <p className='card-title'>{prop.productName}</p>


                <p className='card-text'>Price: {prop.productPrice}$</p>
                <div className='container'>
                    <a href="#" className='btn btn-primary'>Product Page</a>
                    <button className='btn btn-primary'>Add to cart</button>
                </div>
            </div>
        </div>
    )
};

ProductCard.PropTypes = {
    productImgURL: PropTypes.string,
    productName: PropTypes.string,
    productPrice: PropTypes.number,
};

export default ProductCard;
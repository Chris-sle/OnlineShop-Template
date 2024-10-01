import React from 'react';

const HomePage = () => {
    // Example static data for featured products. Replace with real data fetching.
    const featuredProducts = [
        { id: 1, name: 'Product A', price: '29.99', imageUrl: 'https://placehold.co/150' },
        { id: 2, name: 'Product B', price: '19.99', imageUrl: 'https://placehold.co/150' },
        { id: 3, name: 'Product C', price: '39.99', imageUrl: 'https://placehold.co/150' },
        { id: 4, name: 'Product D', price: '49.99', imageUrl: 'https://placehold.co/150' },
    ];

    return (
        <div className="content container justify-content-center text-center">
            <div className="hero p-2">
                <img src="https://placeholder.co/800x300?text=Welcome+to+Our+Shop" alt="Shop Hero" />
            </div>
            <div className="featured-products">
                <h2>Featured Products</h2>
                <div className="row row-cols-4">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="col">
                            <img src={product.imageUrl} alt={product.name} />
                            <h4>{product.name}</h4>
                            <p>${product.price}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="newsletter-signUp">
                <h2>Stay Updated!</h2>
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
            </div>
            <div className="promo-banners row row-cols-4 p-2">
                <div className="col ">
                    <img src="https://placehold.co/200x100/EEE/31343C?font=montserrat&text=Promo+1" alt="Promo 1" />
                </div>
                <div className="col ">
                    <img src="https://placehold.co/200x100/EEE/31343C?font=montserrat&text=Promo+2" alt="Promo 2" />
                </div>
                <div className="col ">
                    <img src="https://placehold.co/200x100/EEE/31343C?font=montserrat&text=Promo+3" alt="Promo 3" />
                </div>
                <div className="col">
                    <img src="https://placehold.co/200x100/EEE/31343C?font=montserrat&text=Promo+4" alt="Promo 4" />
                </div>
            </div>
        </div>
    );
};

export default HomePage;

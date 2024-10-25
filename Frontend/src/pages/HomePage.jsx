import React from 'react';

const HomePage = () => {
    // Example static data for featured products
    const featuredProducts = [
        { id: 1, name: 'Product A', price: '29.99', imageUrl: 'https://placehold.co/150' },
        { id: 2, name: 'Product B', price: '19.99', imageUrl: 'https://placehold.co/150' },
        { id: 3, name: 'Product C', price: '39.99', imageUrl: 'https://placehold.co/150' },
        { id: 4, name: 'Product D', price: '49.99', imageUrl: 'https://placehold.co/150' },
    ];

    return (
        <main className="container text-center pt-2">
            <div className="hero mb-4">
                <img src="https://placeholder.co/800x300?text=Welcome+to+Our+Shop" alt="Shop Hero" className="img-fluid" />
            </div>
            <div className="promo-banners row g-2 mb-4">
                <div className="col-6 col-md-3">
                    <img src="https://placehold.co/200x100/EEE/31343C?font=montserrat&text=Promo+1" alt="Promo 1" className="img-fluid" />
                </div>
                <div className="col-6 col-md-3">
                    <img src="https://placehold.co/200x100/EEE/31343C?font=montserrat&text=Promo+2" alt="Promo 2" className="img-fluid" />
                </div>
                <div className="col-6 col-md-3">
                    <img src="https://placehold.co/200x100/EEE/31343C?font=montserrat&text=Promo+3" alt="Promo 3" className="img-fluid" />
                </div>
                <div className="col-6 col-md-3">
                    <img src="https://placehold.co/200x100/EEE/31343C?font=montserrat&text=Promo+4" alt="Promo 4" className="img-fluid" />
                </div>
            </div>
            <div className="featured-products mb-4">
                <h2>Featured Products</h2>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="col">
                            <div className="card h-100">
                                <img src={product.imageUrl} alt={product.name} className="card-img-top img-fluid" />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">${product.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="newsletter-signup mb-4">
                <h2>Stay Updated!</h2>
                <form>
                    <div className="input-group mb-3">
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Enter your email" 
                            aria-label="Recipient's email" 
                            required 
                        />
                        <button className="btn btn-primary" type="submit">Subscribe</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default HomePage;

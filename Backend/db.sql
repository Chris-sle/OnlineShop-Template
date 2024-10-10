CREATE DATABASE templateShop;
USE templateShop;

CREATE TABLE roles (
    role_id CHAR(36) UNIQUE PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users(
	user_id CHAR(36) UNIQUE PRIMARY KEY,
    user_email VARCHAR(50) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    role_id CHAR(36),
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE products (
	product_id CHAR(36) UNIQUE PRIMARY KEY,
    seller_id CHAR(36),
    product_name VARCHAR(100) NOT NULL,
    product_description TEXT,
    product_price DECIMAL(10, 2) NOT NULL,
    product_ImgUrl VARCHAR(255),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

CREATE TABLE transactions (
	transaction_id CHAR(36) UNIQUE PRIMARY KEY,
    costumer_id CHAR(36),
    total_amount DECIMAL(10,2) NOT NULL,
    current_status ENUM('Pending', 'Completed', 'Cancelled') NOT NULL,
    createdAt TIMESTAMP,
    FOREIGN KEY (costumer_id) REFERENCES users(user_id)
);

CREATE TABLE transactionItems (
	transactionItem_id CHAR(36) UNIQUE PRIMARY KEY,
    transaction_id CHAR(36),
    product_id CHAR(36),
    quantity INT NOT NULL,
    priceAtPurchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE userInfo (
    user_info_id CHAR(36) UNIQUE PRIMARY KEY,
    user_id CHAR(36) UNIQUE,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE userAddresses (
	user_address_id CHAR(36) UNIQUE PRIMARY KEY,
    user_id CHAR(36),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zipCode VARCHAR(20),
    country VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE reviews (
	review_id CHAR(36) UNIQUE PRIMARY KEY,
    product_id CHAR(36),
    user_id CHAR(36),
    rating INT CHECK(rating >= 1 AND rating <=5),
    comment TEXT,
    createdAt TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE categories (
	category_id CHAR(36) UNIQUE PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE productCategories (
	productCategory_id CHAR(36) UNIQUE PRIMARY KEY,
    product_id CHAR(36),
    category_id CHAR(36),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

# Fill table for testing purpuses.

-- roles --
INSERT INTO roles (role_id, role_name) VALUES
(UUID(), 'guest'),
(UUID(), 'customer'),
(UUID(), 'seller'),
(UUID(), 'employee'),
(UUID(), 'admin');

-- users --
INSERT INTO users (user_id, user_email, user_password, role_id, CreatedAt, updatedAt) VALUES
(UUID(), 'guest@example.com', 'hashedpassword1', (SELECT role_id FROM roles WHERE role_name='guest'), NOW(), NOW()),
(UUID(), 'customer@example.com', 'hashedpassword2', (SELECT role_id FROM roles WHERE role_name='customer'), NOW(), NOW()),
(UUID(), 'seller@example.com', 'hashedpassword3', (SELECT role_id FROM roles WHERE role_name='seller'), NOW(), NOW()),
(UUID(), 'employee@example.com', 'hashedpassword4', (SELECT role_id FROM roles WHERE role_name='employee'), NOW(), NOW()),
(UUID(), 'admin@example.com', '$2b$10$kW0eGu4wswQQhRUsxbUxY...ytsqgKLprvJzu8FZvcEd59YGnYnoe', (SELECT role_id FROM roles WHERE role_name='admin'), NOW(), NOW());

-- products --
INSERT INTO products (product_id, seller_id, product_name, product_description, product_price, product_ImgUrl, createdAt, updatedAt) VALUES
(UUID(), (SELECT user_id FROM users WHERE user_email='seller@example.com'), 'Product 1', 'Description of Product 1', 19.99, 'https://placehold.co/200x200/EEE/31343C?font=montserrat&text=Product', NOW(), NOW()),
(UUID(), (SELECT user_id FROM users WHERE user_email='seller@example.com'), 'Product 2', 'Description of Product 2', 29.99, 'https://placehold.co/200x200/EEE/31343C?font=montserrat&text=Product', NOW(), NOW());

-- transactions --
INSERT INTO transactions (transaction_id, costumer_id, total_amount, current_status, createdAt) VALUES
(UUID(), (SELECT user_id FROM users WHERE user_email='customer@example.com'), 49.98, 'Completed', NOW());

-- transactionItems --
INSERT INTO transactionItems (transactionItem_id, transaction_id, product_id, quantity, priceAtPurchase) VALUES
(UUID(), (SELECT transaction_id FROM transactions LIMIT 1), (SELECT product_id FROM products WHERE product_name='Product 1'), 1, 19.99),
(UUID(), (SELECT transaction_id FROM transactions LIMIT 1), (SELECT product_id FROM products WHERE product_name='Product 2'), 1, 29.99);

-- userAddresses --
INSERT INTO userAddresses (user_address_id, user_id, address, city, state, zipCode, country) VALUES
(UUID(), (SELECT user_id FROM users WHERE user_email='customer@example.com'), '123 Main Street', 'Anytown', 'Anystate', '12345', 'CountryName');

-- reviews --
INSERT INTO reviews (review_id, product_id, user_id, rating, comment, createdAt) VALUES
(UUID(), (SELECT product_id FROM products WHERE product_name='Product 1'), (SELECT user_id FROM users WHERE user_email='customer@example.com'), 5, 'Great product!', NOW());

-- catagories --
INSERT INTO categories (category_id, category_name) VALUES
(UUID(), 'Electronics'),
(UUID(), 'Books');

-- productCatagories --
INSERT INTO productCategories (productCategory_id, product_id, category_id) VALUES
(UUID(), (SELECT product_id FROM products WHERE product_name='Product 1'), (SELECT category_id FROM categories WHERE category_name='Electronics'));

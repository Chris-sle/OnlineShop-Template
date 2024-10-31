# E-commerce Web Application

This project is a full-stack e-commerce web application built with Node.js, Express, MySQL for the backend, and React.js for the frontend. The application provides a comprehensive platform for users to browse products, manage their shopping carts, and perform user management activities, including authentication and role-based access.

## Table of Contents

- [Backend Overview](#backend-overview)
- [Frontend Overview](#frontend-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Installation](#backend-installation)
  - [Frontend Installation](#frontend-installation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Backend Overview

The backend service is responsible for the business logic and database interactions for the e-commerce application. It provides a REST API for user management, product management, order processing, and more.

### Features

- **User Authentication:** Register and login functionality with JWT-based authentication.
- **Products Catalog:** Manage products and categories.
- **Order Management:** Handle cart and checkout processes.
- **Role-Based Access Control:** Admin and seller-specific routes.
- **Data Security:** Protection against common web vulnerabilities using Helmet.
- **Cross-Origin Resource Sharing:** Configured to allow requests from the frontend.

### Prerequisites

- Node.js (version 14 or higher)
- MySQL
- npm

### Getting Started

#### Backend Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chris-sle/OnlineShop-Template.git
   cd OnlineShop-Templat/Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file at the root of the backend project.
   - Add the following environment variables:
     ```
     APP_PORT=3000
     JWT_SECRET=your_jwt_secret
     DB_HOST=your_db_host
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=your_db_name
     ```

4. **Set up the database:**
   - Import the tables from `db.sql` into your MySQL database.

5. **Generate SSL certificates:**
   - Place your SSL key and certificate in the `ssl` directory as `server-key.pem` and `server-cert.pem`.

#### Running the Server

Start the HTTPS server:

```bash
npm start
```

The server will be running at `https://localhost:3000`.

## Frontend Overview

The frontend application provides a user-friendly interface for users to interact with the e-commerce platform, featuring product browsing, shopping cart management, and user account functionalities.

### Features

- **Product Browsing:** View and filter products by categories.
- **User Authentication:** Login and registration functionalities with persistent sessions.
- **Shopping Cart:** Add items to the cart and proceed to checkout.
- **Role-Based Dashboard:** Separate views for customers, sellers, and admins.
- **Responsive Design:** Optimized for mobile and desktop using Bootstrap.

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Getting Started

#### Frontend Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chris-sle/OnlineShop-Template.git
   cd OnlineShop-Template/Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory of the frontend.

#### Running the Application

Start the development server:

```bash
npm start
```

The application should now be running at `http://localhost:3000`.

## Project Structure

- **Backend:**
  - **`routes`:** Functionality-specific routes for users, products, and orders.
  - **`middleware`:** Middleware for authentication, authorization, and error handling.
  - **`config`:** Database configuration and connection.
  
- **Frontend:**
  - **`src/components`:** Contains reusable components such as Navbar, Footer, and ProductList.
  - **`src/pages`:** Includes main pages like HomePage, ProductsPage, and AccountPage.
  - **`src/context`:** Context providers for authentication and shopping cart state management.
  - **`src/services`:** Manages API calls and utility functions for data handling.
  - **`src/utilities`:** Manages local storage functions for the cart.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for new features, bug fixes, or improvements.

## License

This project is licensed under the MIT License.
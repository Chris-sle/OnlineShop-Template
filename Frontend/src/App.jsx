import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Layout/Footer.jsx';
import Navbar from './components/Layout/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetail from './components/Products/ProductDetail.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import SellerPage from './pages/SellerPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Importing CartProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* Wrap CartProvider inside AuthProvider */}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/seller" element={<SellerPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
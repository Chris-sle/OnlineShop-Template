import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Layout/Footer.jsx';
import Navbar from './components/Layout/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetail from './components/Products/ProductDetail.jsx';
import AccountPage from './pages/AccountPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import SellerPage from './pages/SellerPage.jsx';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/Account" element={<AccountPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/seller" element={<SellerPage />} />
          </Routes>
          <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

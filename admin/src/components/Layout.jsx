import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../assets/css/Homepage.css';

const Layout = ({ children }) => {
  return (
    <div className="page">
      {/* Reusable Background Pattern Top-Left */}
      <div className="background before"></div>

      {/* Reusable Header */}
      <Header />

      {/* This is where the specific page content (Home, Blog, etc.) will be injected */}
      {children}

      {/* Reusable Footer */}
      <Footer />

      {/* Reusable Background Pattern Bottom-Right */}
      <div className="background after"></div>
    </div>
  );
};

export default Layout;
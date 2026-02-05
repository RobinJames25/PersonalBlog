import React from 'react';
import Header from './Header';
import Footer from './Footer';

// This component ensures every page has the standard width and spacing
const Layout = ({ children }) => {
  return (
    <div className="page">
      {/* 1. The Header is always at the top */}
      <Header />

      {/* 2. 'children' is where Home, Blog, or Newsletter content gets injected */}
      {children}

      {/* 3. The Footer is always at the bottom */}
      <Footer />
    </div>
  );
};

export default Layout;
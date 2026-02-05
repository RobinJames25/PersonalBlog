import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// --- PUBLIC PAGES ---
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Newsletter from './pages/Newsletter';
import BlogDetail from './pages/BlogDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================
            PUBLIC ROUTES (Open to everyone)
           ========================== */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/blog-detail.html" element={<BlogDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
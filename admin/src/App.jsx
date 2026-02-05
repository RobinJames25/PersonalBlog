// ADMIN App.jsx (localhost:5174)
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreatePost from './pages/CreatePost';
// FIXED: Changed './pages/ManagePost' to './pages/ManagePosts' (Plural)
import ManagePosts from './pages/ManagePost'; 
import EditPost from './pages/EditPost';

// Simple Auth Check
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin');
  // If no admin key found, kick them to the login screen
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Redirect Root to the Dashboard (or Login) */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        
        {/* 2. Login Page */}
        {/* I changed this to /admin/login to keep your URLs consistent */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 3. Protected Dashboard Routes */}
        {/* ADDED '/admin' PREFIX TO ALL ROUTES BELOW */}
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        
        <Route path="/admin/manage" element={
          <ProtectedRoute><ManagePosts /></ProtectedRoute>
        } />
        
        <Route path="/admin/create" element={
          <ProtectedRoute><CreatePost /></ProtectedRoute>
        } />
        
        <Route path="/admin/edit/:id" element={
          <ProtectedRoute><EditPost /></ProtectedRoute>
        } />

        {/* Catch-all for 404s (Optional but helpful) */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
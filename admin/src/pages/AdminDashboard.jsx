import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// CHANGE 1: Import your centralized API
import api from '../../api/axios'; 
import Layout from '../components/Layout';
import '../assets/css/Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // CHANGE 2: Make the Live URL dynamic
  // In dev, it uses localhost. In prod, define VITE_CLIENT_URL in Vercel.
  const LIVE_SITE_URL = import.meta.env.VITE_CLIENT_URL || "http://localhost:5173/";

  const handleLogout = async () => {
    try {
      // CHANGE 3: Call the backend to clear the HttpOnly cookie
      // (We will add this endpoint to your backend in a second)
      await api.get('/users/logout');
    } catch (error) {
      console.error("Logout failed on server", error);
    } finally {
      // CHANGE 4: Clear Client UI state
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminName');
      // No need to remove 'token' because we stopped saving it there!
      
      navigate('/admin/login');
    }
  };

  return (
    <Layout>
      <div className="np-wrapper">
        <div className="np-card">
          
          <header className="np-header-flex">
            <div>
              <h1 className="np-title">Admin Overview</h1>
              <p className="np-subtitle">Welcome back. What would you like to do today?</p>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="np-btn-submit"
              style={{ 
                backgroundColor: 'transparent', 
                border: '1px solid var(--np-border)', 
                color: 'var(--np-text-main)',
                boxShadow: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--np-bg-page)';
                  e.currentTarget.style.borderColor = 'var(--np-text-muted)';
              }}
              onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--np-border)';
              }}
            >
              Log Out
            </button>
          </header>

          <div className="np-dashboard-grid">
            
            {/* 1. Manage Posts */}
            <Link to="/admin/manage" className="np-dashboard-card">
              <span className="np-icon-large" role="img" aria-label="folder">📂</span>
              <div className="np-card-title">Manage Articles</div>
              <div className="np-card-desc">
                View, edit, or delete your existing blog posts.
              </div>
            </Link>

            {/* 2. Create New */}
            <Link to="/admin/create" className="np-dashboard-card">
              <span className="np-icon-large" role="img" aria-label="write">✍️</span>
              <div className="np-card-title">Create New</div>
              <div className="np-card-desc">
                Draft a new story and publish it to the world.
              </div>
            </Link>

            {/* 3. View Live Site */}
            <a 
              href={LIVE_SITE_URL} 
              className="np-dashboard-card" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span className="np-icon-large" role="img" aria-label="home">🏠</span>
              <div className="np-card-title">View Live Site</div>
              <div className="np-card-desc">
                Check how your blog looks to visitors right now.
              </div>
            </a>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
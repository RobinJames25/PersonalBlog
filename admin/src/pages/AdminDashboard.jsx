import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../assets/css/Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Define your live site URL here (or use an environment variable)
  const LIVE_SITE_URL = "http://localhost:5173/";

const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
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
                boxShadow: 'none'
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
            
            {/* 1. Manage Posts (Internal Link) */}
            <Link to="/admin/manage" className="np-dashboard-card">
              <span className="np-icon-large" role="img" aria-label="folder">📂</span>
              <div className="np-card-title">Manage Articles</div>
              <div className="np-card-desc">
                View, edit, or delete your existing blog posts.
              </div>
            </Link>

            {/* 2. Create New (Internal Link) */}
            <Link to="/admin/create" className="np-dashboard-card">
              <span className="np-icon-large" role="img" aria-label="write">✍️</span>
              <div className="np-card-title">Create New</div>
              <div className="np-card-desc">
                Draft a new story and publish it to the world.
              </div>
            </Link>

            {/* 3. View Live Site (EXTERNAL LINK FIX) */}
            {/* Changed from <Link> to <a> because it is on a different port */}
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
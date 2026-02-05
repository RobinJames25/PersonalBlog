import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import '../assets/css/Admin.css'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const endpoint = isSignup ? 'signup' : 'login';
    const url = `http://localhost:5000/api/users/${endpoint}`;

    try {
      const res = await axios.post(url, { email, password });

      // 1. Get Data from Response
      const token = res.data.token;
      // Check if backend sent a name, otherwise split email to create a name
      const userName = res.data.name || email.split('@')[0]; 
      
      // 2. Save to LocalStorage
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminName', userName); // <--- SAVING THE NAME HERE

      // 3. Alert & Redirect
      alert(isSignup ? "Account Created! Welcome." : "Login Successful!");
      navigate('/admin/dashboard'); 

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Authentication failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="np-wrapper">
        <div className="np-card" style={{ maxWidth: '450px' }}>
          
          <header className="np-header">
            <h1 className="np-title">
              {isSignup ? 'Create Account' : 'Admin Portal'}
            </h1>
            <p className="np-subtitle">
              {isSignup ? 'Register to manage your blog' : 'Please authenticate to continue'}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="np-form">
            <div className="np-field">
              <label className="np-label">Email Address</label>
              <input 
                type="email" 
                className="np-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>

            <div className="np-field">
              <label className="np-label">Password</label>
              <input 
                type="password" 
                className="np-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button 
                type="submit" 
                className="np-btn-submit" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Login')}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--np-text-muted)' }}>
                {isSignup ? "Already have an account?" : "Don't have an account?"}
                <span 
                  onClick={() => setIsSignup(!isSignup)} 
                  className="np-toggle-link"
                >
                  {isSignup ? 'Login here' : 'Sign up'}
                </span>
            </div>
          </form>

        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
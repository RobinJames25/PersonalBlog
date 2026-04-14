import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Layout from '../components/Layout';
import '../assets/css/Admin.css'; 

const AdminResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Extract the token from the URL (e.g., /reset-password/:token)
  const { token } = useParams(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);

    try {
      // Send the patch request to your reset password endpoint
      const res = await api.patch(`/users/resetPassword/${token}`, { password });

      // If successful, the backend automatically logs them in and sets the cookie
      const userName = res.data.data?.user?.email.split('@')[0] || 'Admin';
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminName', userName); 

      alert("Password successfully reset! You are now logged in.");
      navigate('/admin/dashboard'); 

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Invalid or expired token.";
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
            <h1 className="np-title">Set New Password</h1>
            <p className="np-subtitle">Please enter your new secure password.</p>
          </header>

          <form onSubmit={handleSubmit} className="np-form">
            <div className="np-field">
              <label className="np-label">New Password</label>
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

            <div className="np-field">
              <label className="np-label">Confirm New Password</label>
              <input 
                type="password" 
                className="np-input" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Resetting...' : 'Update Password'}
            </button>
          </form>

        </div>
      </div>
    </Layout>
  );
};

export default AdminResetPassword;
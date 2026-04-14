import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; 
import Layout from '../components/Layout';
import '../assets/css/Admin.css'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // NEW STATE
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- FLOW 1: FORGOT PASSWORD ---
      if (isForgotPassword) {
        const res = await api.post('/users/forgotPassword', { email });
        alert("If an account exists, a reset link has been generated. (Check console for URL during testing)");
        console.log("TESTING ONLY - Reset URL:", res.data.resetURL);
        setIsForgotPassword(false); // Go back to login screen
      } 
      // --- FLOW 2: LOGIN / SIGNUP ---
      else {
        const endpoint = isSignup ? '/users/signup' : '/users/login';
        const res = await api.post(endpoint, { email, password });

        const userName = res.data.data?.user?.email.split('@')[0] || 'Admin';
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminName', userName); 

        alert(isSignup ? "Account Created! Welcome." : "Login Successful!");
        navigate('/admin/dashboard'); 
      }
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
              {isForgotPassword ? 'Reset Password' : (isSignup ? 'Create Account' : 'Admin Portal')}
            </h1>
            <p className="np-subtitle">
              {isForgotPassword 
                ? 'Enter your email to receive a reset link' 
                : (isSignup ? 'Register to manage your blog' : 'Please authenticate to continue')}
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

            {/* Hide password field if they are resetting their password */}
            {!isForgotPassword && (
              <div className="np-field">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="np-label">Password</label>
                  {!isSignup && (
                    <span 
                      onClick={() => setIsForgotPassword(true)}
                      className="np-toggle-link"
                      style={{ fontSize: '0.85rem', margin: 0, fontWeight: 'normal' }}
                    >
                      Forgot Password?
                    </span>
                  )}
                </div>
                <input 
                  type="password" 
                  className="np-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isForgotPassword} // Only required if not forgot password flow
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            )}

            <button 
                type="submit" 
                className="np-btn-submit" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : (
                  isForgotPassword ? 'Send Reset Link' : (isSignup ? 'Create Account' : 'Login')
                )}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--np-text-muted)' }}>
                {isForgotPassword ? (
                  <>
                    Remember your password? 
                    <span onClick={() => setIsForgotPassword(false)} className="np-toggle-link">
                      Back to Login
                    </span>
                  </>
                ) : (
                  <>
                    {isSignup ? "Already have an account?" : "Don't have an account?"}
                    <span onClick={() => setIsSignup(!isSignup)} className="np-toggle-link">
                      {isSignup ? 'Login here' : 'Sign up'}
                    </span>
                  </>
                )}
            </div>
          </form>

        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
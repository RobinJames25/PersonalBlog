import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Layout from '../components/Layout';
import '../assets/css/Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');

    // 1. Validation logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      return;
    }

    // 2. Prepare the data for EmailJS
    const templateParams = {
      name: "New Subscriber",
      email: email,
      message: "Please add this user to the newsletter list."
    };

    // 3. Send the email
    emailjs.send(
      'service_jmyj1oy',   // Your Service ID
      'template_vb8if7a',  // Your Template ID
      templateParams,
      'AwrSsIb_vK4bTNhk-'  // Your Public Key
    )
    .then((result) => {
        console.log(result.text);
        setStatus('success');
        setEmail('');
    }, (error) => {
        console.log(error.text);
        setStatus('error');
    });
  };

  return (
    <Layout>
      <div className="newsletter-page-wrapper">
        
        {/* Main Subscription Card */}
        <section className="newsletter-card">
          <h1 className="newsletter-title">Join the Inner Circle</h1>
          <p className="newsletter-desc">
            Get the latest articles, coding tutorials, and personal updates 
            delivered straight to your inbox. No spam, just high-quality content.
          </p>

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="email" 
                className="newsletter-input"
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'submitting' || status === 'success'}
                required
              />
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="status-message error">
                Oops! Something went wrong. Please check your email and try again.
              </div>
            )}

            {/* Success Message */}
            {status === 'success' && (
              <div className="status-message success">
                🎉 You’re subscribed! Check your inbox for updates.
              </div>
            )}

            <button 
              type="submit" 
              className="newsletter-btn"
              disabled={status === 'submitting' || status === 'success'}
            >
              {status === 'submitting' ? 'Signing you up...' : 'Subscribe Free'}
            </button>
            
            <p className="newsletter-note">
              Unsubscribe at any time. Your email is safe with me.
            </p>
          </form>
        </section>

      </div>
    </Layout>
  );
};

export default Newsletter;
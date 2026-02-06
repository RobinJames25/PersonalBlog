import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for smoother navigation
// CHANGE 1: Import centralized API
import api from '../../api/axios'; 
import Layout from '../components/Layout'; 
import '../assets/css/Admin.css'; 
import '../assets/css/Createpost.css'; 

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState(''); 
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // --- Auto-generate Slug ---
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val.toLowerCase().trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
    setSlug(generatedSlug);
  };

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // CHANGE 2: Use api.post (No need for full URL)
      // Note: 'Content-Type': 'multipart/form-data' is typically handled automatically 
      // by the browser when sending FormData, but keeping it explicit is fine.
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageUrl = response.data.url;
      
      // Insert HTML image tag into content
      const imageHtml = `\n<img src="${imageUrl}" alt="Image" style="max-width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">\n`;
      setContent(prev => prev + imageHtml);
      alert("Image inserted into editor!");

    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    try {
      // CHANGE 3: Remove manual Token extraction!
      // The HttpOnly cookie is automatically sent by 'withCredentials: true' in api/axios.js
      
      const response = await api.post('/posts', {
        title, slug, summary, content,
      });

      if (response.status === 200 || response.status === 201) {
        // CHANGE 4: Use navigate instead of reload
        navigate('/admin/dashboard'); 
      }
    } catch (error) {
      console.error(error);
      // Optional: Handle 401 Unauthorized specifically
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
        navigate('/admin/login');
      } else {
        alert("Failed to create post. Check console for details.");
      }
    }
  };

  return (
    <Layout>
      <div className="np-wrapper">
        <div className="np-card create-post-card">
          
          <header className="np-header">
            <h1 className="np-title">Write New Article</h1>
            <p className="np-subtitle">Share your knowledge with the world</p>
          </header>

          <form onSubmit={createPost} className="np-form">
            
            {/* 1. Title */}
            <div className="np-field">
              <label className="np-label">Headline</label>
              <input 
                type="text" 
                className="np-input" 
                placeholder="e.g. The Future of React" 
                value={title} 
                onChange={handleTitleChange} 
                required 
              />
            </div>

            {/* 2. Slug & Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="np-field">
                <label className="np-label">URL Slug</label>
                <input 
                    type="text" 
                    className="np-input" 
                    placeholder="the-future-of-react" 
                    value={slug} 
                    onChange={e => setSlug(e.target.value)} 
                    required 
                />
                </div>
                
                <div className="np-field">
                <label className="np-label">Short Summary</label>
                <input 
                    type="text" 
                    className="np-input" 
                    placeholder="Brief intro for the card preview..." 
                    value={summary} 
                    onChange={ev => setSummary(ev.target.value)} 
                />
                </div>
            </div>

            {/* 3. Content Editor */}
            <div className="np-field">
              <label className="np-label">Content Body (HTML)</label>
              
              {/* Image Upload Tool */}
              <div className="np-upload-bar">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleImageUpload} 
                  accept="image/*"
                />
                <button 
                  type="button" 
                  className="np-upload-btn" 
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                >
                  <span style={{ fontSize: '1.2rem' }}>📷</span>
                  {uploading ? 'Uploading...' : 'Insert Image'}
                </button>
                <span className="np-upload-hint">
                  Select an image to upload and append to your post.
                </span>
              </div>

              <textarea 
                className="np-input np-editor" 
                placeholder="<p>Start writing your masterpiece...</p>"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* 4. Actions */}
            <div className="np-actions">
              <button type="submit" className="np-btn-submit">
                 Publish Post
              </button>
              <button 
                type="button" 
                className="np-btn-cancel" 
                onClick={() => navigate(-1)} // Go back to previous page
              >
                 Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
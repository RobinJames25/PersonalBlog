import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import '../assets/css/Admin.css'; 
import '../assets/css/Createpost.css';

const EditPost = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 1. Fetch the existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
        const post = response.data;
        setTitle(post.title);
        setSlug(post.slug);
        setSummary(post.summary);
        setContent(post.content);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Could not load post data.");
      }
    };
    fetchPost();
  }, [id]);

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = response.data.url;
      const imageHtml = `\n<img src="${imageUrl}" alt="Uploaded Image" style="max-width: 100%; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">\n`;
      setContent(prev => prev + imageHtml);
      alert("Image inserted!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Is the server running?");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 2. Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Optional: Add Authorization header if needed
      // const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/posts/${id}`, {
        title,
        slug, 
        summary,
        content,
      });
      alert('Post Updated Successfully!');
      navigate('/admin/manage'); 
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  // Loading State
  if (loading) return (
    <Layout>
      <div className="np-wrapper">
        <div style={{ fontSize: '1.2rem', color: 'var(--np-text-muted)' }}>Loading post data...</div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="np-wrapper">
        {/* Added 'create-post-card' to make it wider */}
        <div className="np-card create-post-card">
          
          <header className="np-header">
            <h1 className="np-title">Edit Article</h1>
            <p className="np-subtitle">Update your existing content</p>
          </header>
          
          <form onSubmit={handleUpdate} className="np-form">
            
            {/* Title */}
            <div className="np-field">
              <label className="np-label">Headline</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="np-input" 
                required 
              />
            </div>

            {/* LOCKED SLUG - Styled with variables for Dark Mode */}
            <div className="np-field">
              <label className="np-label">Slug (URL ID)</label>
              <input 
                type="text" 
                value={slug} 
                disabled 
                className="np-input" 
                style={{ 
                    backgroundColor: 'var(--np-bg-page)', 
                    color: 'var(--np-text-muted)',
                    cursor: 'not-allowed',
                    opacity: 0.8
                }} 
              />
              <small className="np-upload-hint" style={{ marginTop: '0.5rem' }}>
                <span style={{ color: '#d97706', fontWeight: 'bold' }}>Note:</span> Slugs cannot be changed to preserve SEO links.
              </small>
            </div>
            
            {/* Summary */}
            <div className="np-field">
              <label className="np-label">Short Summary</label>
              <input 
                type="text" 
                value={summary} 
                onChange={e => setSummary(e.target.value)} 
                className="np-input" 
              />
            </div>

            {/* Content Editor */}
            <div className="np-field">
              <label className="np-label">Content Body (HTML)</label>
              
              {/* IMAGE UPLOAD BAR */}
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
                  Uploads and appends HTML code to the editor.
                </span>
              </div>

              <textarea 
                className="np-input np-editor" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
              />
            </div>

            {/* Actions */}
            <div className="np-actions">
              <button type="submit" className="np-btn-submit">
                Save Changes
              </button>
              <button type="button" className="np-btn-cancel" onClick={() => navigate('/admin/manage')}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditPost;
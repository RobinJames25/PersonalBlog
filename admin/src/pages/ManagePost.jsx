import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// CHANGE 1: Import centralized API
import api from '../../api/axios'; 
import Layout from '../components/Layout';
import '../assets/css/Admin.css';

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts on load
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // CHANGE 2: Use api.get (Auto-points to correct URL)
      const response = await api.get('/posts');
      
      // CHANGE 3: Safe Data Unwrapping
      // (Handles cases where backend returns [..] or { data: [..] })
      const data = response.data;
      if (Array.isArray(data)) {
        setPosts(data);
      } else if (data.data && Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        setPosts([]);
      }

    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE FUNCTION
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      try {
        // CHANGE 4: Use api.delete
        // The HttpOnly cookie is sent automatically, authorizing the deletion.
        await api.delete(`/posts/${id}`);
        
        // Remove the deleted post from the UI
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
            alert("Session expired. Please login again.");
        } else {
            alert("Failed to delete post");
        }
      }
    }
  };

  return (
    <Layout>
      <div className="np-wrapper">
        
        {/* We use the standard card, but ensure it allows full width for the table */}
        <div className="np-card" style={{ maxWidth: '1100px' }}>
          
          {/* HEADER SECTION */}
          <header className="np-header-flex">
            <div>
              <h1 className="np-title">Manage Articles</h1>
              <p className="np-subtitle">Overview of your published content</p>
            </div>
            
            <Link to="/admin/create" className="np-btn-create">
              <span style={{ fontSize: '1.2rem', lineHeight: 0 }}>+</span> Create New
            </Link>
          </header>

          {/* TABLE SECTION */}
          <div className="np-table-container">
            <table className="np-table">
              <thead>
                <tr>
                  <th>Article Title</th>
                  <th>Date Published</th>
                  <th>URL Slug</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              
              <tbody>
                {/* CHANGE 5: Added Array.isArray check to prevent crashes */}
                {!loading && Array.isArray(posts) && posts.map((post) => (
                  <tr key={post.id}>
                    {/* Title */}
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--np-text-main)' }}>
                        {post.title}
                      </div>
                    </td>
                    
                    {/* Date */}
                    <td>
                      <div style={{ color: 'var(--np-text-muted)', fontSize: '0.9rem' }}>
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Slug Badge */}
                    <td>
                      <span style={{ 
                        backgroundColor: 'var(--np-bg-page)', 
                        padding: '4px 8px', 
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        color: 'var(--np-text-muted)',
                        border: '1px solid var(--np-border)'
                      }}>
                        /{post.slug || 'no-slug'}
                      </span>
                    </td>

                    {/* Actions Buttons */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link to={`/admin/edit/${post.id}`}>
                          <button className="np-btn-icon np-btn-edit" title="Edit Post">
                            ✎ Edit
                          </button>
                        </Link>
                        
                        <button 
                          className="np-btn-icon np-btn-delete" 
                          onClick={() => handleDelete(post.id)}
                          title="Delete Post"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {!loading && posts.length === 0 && (
              <div style={{ 
                padding: '4rem', 
                textAlign: 'center', 
                color: 'var(--np-text-muted)',
                fontStyle: 'italic'
              }}>
                No posts found. Click "Create New" to write your first article.
              </div>
            )}
            
            {/* Loading State */}
            {loading && (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--np-text-muted)' }}>
                Loading content...
              </div>
            )}

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ManagePosts;
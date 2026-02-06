import React, { useEffect, useState } from 'react';
import api from '../../api/axios'; // Updated import
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../assets/css/Blog.css'; 

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch Posts (Using centralized API)
  useEffect(() => {
    api.get('/posts')
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 2. Filter Logic (Search by Title or Summary)
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.summary && post.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <main className="blog-container">
        
        {/* HEADER & SEARCH */}
        <section className="blog-header">
          <h1 className="blog-title">The Archive</h1>
          <p className="blog-intro">
            Thoughts, tutorials, and development logs. 
            Everything I've written about my journey in code.
          </p>
          
          <div className="search-wrapper">
            <input 
              type="text" 
              className="search-input"
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* POSTS GRID */}
        <section className="blog-grid">
          {loading ? (
             <p>Loading articles...</p>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <article key={post.id} className="blog-card">
                <span className="card-date">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>

                <Link to={`/blog-detail.html?id=${post.id}`}>
                    <h2 className="card-title">{post.title}</h2>
                </Link>

                <p className="card-summary">
                  {post.summary || "Click to read the full article..."}
                </p>

                <Link to={`/blog-detail.html?id=${post.id}`} className="card-link">
                  Read Article &rarr;
                </Link>
              </article>
            ))
          ) : (
            <div className="no-results">
              <p>No articles found matching "{searchTerm}".</p>
            </div>
          )}
        </section>

      </main>
    </Layout>
  );
};

export default Blog;
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios'; // Updated import
import Layout from '../components/Layout';
import { blogPosts as staticPosts } from '../data/blogPosts'; 
import '../assets/css/Blogdetail.css';

const BlogDetail = () => {
  const [searchParams] = useSearchParams();
  
  // 1. Grab parameters
  const dbId = searchParams.get('id');       
  const staticSlug = searchParams.get('article'); 

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);
      setPost(null);

      try {
        // CASE A: Database Post (Using centralized API)
        if (dbId) {
          const response = await api.get(`/posts/${dbId}`);
          setPost(response.data);
        } 
        // CASE B: Static Post
        else if (staticSlug) {
          const found = staticPosts.find((p) => p.id === staticSlug || p.slug === staticSlug);
          if (found) {
            setPost(found);
          } else {
            setError(true);
          }
        } 
        // CASE C: Invalid URL
        else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [dbId, staticSlug]);

  // --- 1. LOADING STATE ---
  if (loading) {
    return (
      <Layout>
        <div className="status-container">
          <p className="status-text">Loading article...</p>
        </div>
      </Layout>
    );
  }

  // --- 2. NOT FOUND STATE ---
  if (error || !post) {
    return (
      <Layout>
        <div className="status-container">
          <h1 className="status-title">Article Not Found</h1>
          <p className="status-text">
            The post you are looking for might have been moved or deleted.
          </p>
          <Link to="/blog" className="btn-primary">
            Back to Articles
          </Link>
        </div>
      </Layout>
    );
  }

  // --- 3. SUCCESS STATE ---
  const dateString = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : post.date;

  return (
    <Layout>
      <article className="article-container">
        
        {/* Header */}
        <header className="article-header">
          <Link to="/blog" className="back-link">
             &larr; Back to Archive
          </Link>
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            <span>{dateString}</span>
          </div>
        </header>
        
        {/* Content Body */}
        <div 
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* Footer */}
        <footer className="article-footer">
           <p>Thanks for reading. Check out more posts below.</p>
           <Link to="/blog" className="back-link">
             Browse All Articles
           </Link>
        </footer>

      </article>
    </Layout>
  );
};

export default BlogDetail;
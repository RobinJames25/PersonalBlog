import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../../api/axios.js'; // Updated import
import Layout from '../components/Layout';

// Asset Imports
import xLogo from '../assets/logo-x.svg';
import gitHubLogo from '../assets/logo-github.svg';
import linkedinLogo from '../assets/logo-linkedin.svg';
import frontendMentorLogo from '../assets/logo-frontend-mentor.svg';
import '../assets/css/Homepage.css';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
  api.get('/posts')
    .then(response => {
      console.log("API RESPONSE:", response.data); // <--- Add this line!
      setPosts(response.data); 
    })
    .catch(err => console.error(err));
}, []);

  return (
    <Layout>
      <main className="container">
        {/* 1. HERO SECTION */}
        <section className="intro">
          <h1 className="intro__title">
            Hi, I'm Robin. <br />
            I build things for the web.
          </h1>
          <p className="intro__text">
            I'm a fullstack developer documenting my journey. 
            Here you'll find my latest experiments, tutorials, and thoughts on code.
          </p>
          
          <div className="intro__list">
            <a href="#X" className="intro__item-link" aria-label="Twitter">
              <img src={xLogo} alt="" className="intro__social" />
            </a>
            <a href="#GitHub" className="intro__item-link" aria-label="GitHub">
              <img src={gitHubLogo} alt="" className="intro__social" />
            </a>
            <a href="#Linkedin" className="intro__item-link" aria-label="LinkedIn">
              <img src={linkedinLogo} alt="" className="intro__social" />
            </a>
            <a href="#FrontendMentor" className="intro__item-link" aria-label="Frontend Mentor">
              <img src={frontendMentorLogo} alt="" className="intro__social" />
            </a>
          </div>
        </section>

        {/* 2. ARTICLES GRID */}
        <section className="articles">
          <h2 className="articles__title">Latest Writing</h2>
          
          <div className="articles__latest">
           {posts.length > 0 ? (
              posts.map(post => (
                <article key={post.id} className="article-card">
                  <span className="articles__article-date">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                  
                  <Link to={`/blog-detail.html?id=${post.id}`}>
                    <h3 className="articles__article-title">{post.title}</h3>
                  </Link>

                  <p className="articles__article-summary">
                    {post.summary || "Click to read the full story..."}
                  </p>

                  <Link to={`/blog-detail.html?id=${post.id}`} className="read-more">
                    Read Article &rarr;
                  </Link>
                </article>
              ))
            ) : (
              <p>No articles found. Go to <Link to="/create" style={{color: 'var(--accent)'}}>/create</Link> to start.</p>
            )}
          </div>

          <div style={{marginTop: '3rem', textAlign: 'center'}}>
            <Link to="/blog" style={{fontWeight: '600', color: 'var(--accent)'}}>
              View Full Archive
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
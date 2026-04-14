import React from 'react';
import Layout from '../components/Layout';
import imageWorkspaceSmall from '../assets/image-workspace-large.jpg';
import xLogo from '../assets/logo-x.svg';
import gitHubLogo from '../assets/logo-github.svg';
import linkedinLogo from '../assets/logo-linkedin.svg';
import frontendMentorLogo from '../assets/logo-frontend-mentor.svg';
import '../assets/css/About.css';

const About = () => {
  const bookList = [
    { id: 1, title: "The Pragmatic Programmer", author: "Andrew Hunt", reason: "Insights into software craftsmanship." },
    { id: 2, title: "Ready Player One", author: "Ernest Cline", reason: "Futuristic escapism & pop culture." },
    { id: 3, title: "The Hobbit", author: "J.R.R. Tolkien", reason: "Classic fantasy adventure." },
    { id: 4, title: "Educated", author: "Tara Westover", reason: "A story of resilience and learning." }
  ];

  return (
    <Layout>
      <main className="about-container">
        
        {/* 1. HERO SECTION (Split Layout) */}
        <section className="about-hero">
          <div className="about-content">
            <h1 className="about-title">More than just code.</h1>
            <p className="about-text">
              Hi, I'm Robin! I've always been driven by creativity and logic. 
              Front-end development is where those two worlds collide for me. 
              There's a unique magic in turning a static design into a living, breathing interface.
            </p>
            <p className="about-text">
              When I'm not debugging CSS, you can find me hiking the nearest trail 
              or getting lost in a good book. I believe that stepping away from the screen 
              is just as important as the work itself—it's usually where my best ideas come from.
            </p>
          </div>

          <div className="workspace-wrapper">
             <img src={imageWorkspaceSmall} alt="My Workspace" className="about-img" />
          </div>
        </section>

        {/* 2. BOOKSHELF GRID */}
        <section className="books-section">
          <h2 className="about-section-title">On My Bookshelf</h2>
          <div className="books-grid">
            {bookList.map((book) => (
              <div key={book.id} className="book-card">
                <h3 className="book-title">{book.title}</h3>
                <span className="book-author">{book.author}</span>
                <p className="book-reason">"{book.reason}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CONNECT SECTION */}
        <section className="connect-section">
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>
            Let's Connect
          </h2>
          <p className="about-text" style={{ maxWidth: '600px', margin: '0 auto' }}>
            I'm always open to discussing new projects, creative ideas, or opportunities 
            to be part of your visions.
          </p>

          <div className="socials-list">
            <a href="#X" className="social-link" aria-label="Twitter">
              <img src={xLogo} alt="" className="social-icon" />
            </a>
            <a href="https://github.com/RobinJames25" className="social-link" aria-label="GitHub">
              <img src={gitHubLogo} alt="" className="social-icon" />
            </a>
            <a href="https://www.linkedin.com/in/robinjames25/" className="social-link" aria-label="LinkedIn">
              <img src={linkedinLogo} alt="" className="social-icon" />
            </a>
            <a href="https://www.frontendmentor.io/profile/RobinJames25" className="social-link" aria-label="Frontend Mentor">
              <img src={frontendMentorLogo} alt="" className="social-icon" />
            </a>
          </div>
        </section>

      </main>
    </Layout>
  );
};

export default About;
import React from 'react';
import xLogo from '../assets/logo-x.svg';
import gitHubLogo from '../assets/logo-github.svg';
import linkedinLogo from '../assets/logo-linkedin.svg';
import frontendMentorLogo from '../assets/logo-frontend-mentor.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <p className="footer__text">
            © {new Date().getFullYear()} Robin. Built with React.
        </p>
        
        <ul className="footer__list" style={{display: 'flex', gap: '1rem'}}>
          <li><a href="#X"><img src={xLogo} alt="X" className="footer__social"/></a></li>
          <li><a href="#GitHub"><img src={gitHubLogo} alt="GitHub" className="footer__social"/></a></li>
          <li><a href="#Linkedin"><img src={linkedinLogo} alt="LinkedIn" className="footer__social"/></a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
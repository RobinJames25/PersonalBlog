import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import iconMoon from '../assets/icon-moon.svg';
import iconSun from '../assets/icon-sun.svg';
import iconMenu from '../assets/icon-menu.png'; 
import iconClose from '../assets/icon-close.svg'; 
import MyAvatar from '../assets/MyAvatar.jpeg';

const Header = () => {
  const location = useLocation(); 
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Robin'); 

  // Check if we are in the admin section
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Logic to determine which name to show
    if (isAdmin) {
      const storedName = localStorage.getItem('adminName');
      if (storedName) {
        setDisplayName(storedName.charAt(0).toUpperCase() + storedName.slice(1));
      } else {
        setDisplayName('Admin');
      }
    } else {
      setDisplayName('Admin'); // Public Site Name
    }
  }, [isAdmin, location]);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : '';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => setIsMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <div className="container header__content">
        
        {/* BRAND AREA */}
        <Link to={isAdmin ? "/admin/dashboard" : "/"} className="header__brand">
          <img src={MyAvatar} alt="Profile" className="header__avatar" />
          <span className="header__title">{displayName}.</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        {/* Removed !isAdmin check so 'Home' shows everywhere */}
        <nav className="header__nav-desktop">
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
        </nav>

        {/* CONTROLS */}
        <div className="header__controls">
            <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle Theme">
                <img src={isDarkMode ? iconSun : iconMoon} alt="Theme" />
            </button>

            {/* Mobile Menu Button */}
            {/* Removed !isAdmin check so mobile users can also see the menu */}
            <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                <img src={isMenuOpen ? iconClose : iconMenu} alt="Menu" />
            </button>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="mobile-link">Home</Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
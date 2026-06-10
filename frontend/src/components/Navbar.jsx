import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change or clicking outside
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Hall of Fame', path: '/halloffame' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Fest', path: '/fest' },
    { name: 'Recruitment', path: '/recruitment' },
    { name: 'Live', path: '/live' },
  ];

  const logoUrl = "https://i.ibb.co/BVynkP6y/New-Project-20-3-D39-AA5.png";

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="nav-left-section">
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <Link to="/" className="logo">
              <img src={logoUrl} alt="Samashti Logo" className="logo-img" />
              <span className="logo-text">SAMASHTI</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/juyf" className={`nav-link ${location.pathname === '/juyf' ? 'active' : ''}`}>JUYF</Link>
          </div>

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile menu */}
          <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/juyf" className="mobile-link" onClick={() => setIsOpen(false)}>JUYF</Link>
          </div>
        </div>
      </nav>

      {/* Left Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} onClick={() => setIsSidebarOpen(false)} />

      <div className={`left-sidebar ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <img src={logoUrl} alt="Samashti" className="sidebar-logo" />
          <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="sidebar-links">
          <Link to="/about" className="sidebar-link">About Us</Link>
          <Link to="/feedback" className="sidebar-link">Feedback</Link>
          <Link to="/admin" className="sidebar-link">Admin</Link>
          <Link to="/privacy" className="sidebar-link">Privacy Policy</Link>
          <Link to="/terms" className="sidebar-link">Terms and Conditions</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;

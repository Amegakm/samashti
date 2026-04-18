import React from 'react';
import { Mail, MapPin } from 'lucide-react';
// import { Mail, Instagram, Twitter, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2>SAMASHTI</h2>
          <p>Inspiring students, defining culture, and building the leaders of tomorrow.</p>
          <div className="social-links">
            <a href="#">IG</a>
            <a href="#">TW</a>
            <a href="#"><Mail size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/halloffame">Hall of Fame</a></li>
            <li><a href="/recruitment">Join Samashti</a></li>
            <li><a href="/fest">Events</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <ul>
            <li><MapPin size={18} /> Jain University, Bangalore</li>
            <li><Mail size={18} /> samashtiofficial@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} Samashti Student Council. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

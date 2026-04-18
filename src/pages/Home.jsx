import React from 'react';
import { motion } from 'framer-motion';
// import { Trophy, Calendar, Zap, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    { title: 'Samyoga', desc: 'The Cultural Fest - Music, Theatre & Fine Arts.', icon: '🎭', path: '/fest#samyoga' },
    { title: 'Pulse', desc: 'The Dance Fest - Celebrating every rhythm.', icon: '💃', path: '/fest#pulse' },
    { title: 'Sankalpa', desc: 'The Tech Fest - Digital innovation & gaming.', icon: '💻', path: '/fest#sankalpa' },
    { title: 'Samanvaya', desc: 'Commerce & Business leadership.', icon: '💼', path: '/fest#samanvaya' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
          <video autoPlay loop muted className="hero-video">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-gold-and-black-3d-background-30040-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            SAMASHTI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            "Conquer From Within"
            <br />
            The official student council of JAIN (Deemed-to-be University).
          </motion.p>
          <motion.div
            className="hero-btns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/recruitment" className="primary-btn">Join Samashti</Link>
            <Link to="/about" className="secondary-btn">Explore More {'>'}</Link>
          </motion.div>
        </div>
      </section>

      {/* Explore Grid */}
      <section className="section-padding">
        <div className="container">
          <h2 className="section-title">Explore Samashti</h2>
          <div className="feature-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card glass"
                whileHover={{ y: -10, borderColor: 'rgba(255, 215, 0, 0.4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={f.path} className="feature-card-link">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Brief */}
      <section className="about-brief">
        <div className="container">
          <div className="brief-content glass">
            <h2>Our Core Mission</h2>
            <p>
              Samashti is the vibrant cultural forum of Jain University, bringing together creativity and talent under one platform. 
              We celebrate diverse art forms and provide students with opportunities to express themselves and showcase their skills.
            </p>
            <Link to="/about" className="text-btn">Read our story {'>'}</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

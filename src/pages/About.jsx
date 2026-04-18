import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Shield, Rocket, Users, Heart } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page container section-padding">
      {/* Hero Section */}
      <motion.div 
        className="about-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>About Samashti</h1>
        <p className="motto">"Conquer from Within"</p>
        <p className="description">
          Derived from the word meaning <strong>"Harmony"</strong> and <strong>"Synergy,"</strong> 
          Samashti is the central governing student body of JAIN (Deemed-to-be University). 
          We are the collective voice, spirit, and leadership of our vibrant student community.
        </p>
      </motion.div>

      {/* Mission & Vision Grid */}
      <div className="mission-vision-grid">
        <motion.div 
          className="mv-card glass"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="mv-icon"><Target size={32} /></div>
          <h3>Our Mission</h3>
          <p>
            To inspire students to discover their true potential, strengthen their capabilities, 
            and evolve into confident, responsible individuals who lead with purpose.
          </p>
        </motion.div>
        <motion.div 
          className="mv-card glass"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="mv-icon"><Eye size={32} /></div>
          <h3>Our Vision</h3>
          <p>
            To be a unifying platform that facilitates collaboration, innovation, and growth, 
            shaping a campus culture that excels beyond academics.
          </p>
        </motion.div>
      </div>

      {/* Core Values */}
      <section className="section-padding">
        <h2 className="section-title">Core Principles</h2>
        <div className="values-grid">
          <div className="value-item">
            <Rocket className="value-icon" />
            <h3>Platform for Growth</h3>
            <p>Providing an inclusive environment where students can discover, exhibit, and hone their talents across cultural, academic, and professional domains.</p>
          </div>
          <div className="value-item">
            <Shield className="value-icon" />
            <h3>Leadership & Discipline</h3>
            <p>Cultivating creativity, teamwork, and accountability through a culture of discipline and professional excellence.</p>
          </div>
          <div className="value-item">
            <Users className="value-icon" />
            <h3>Unified Success</h3>
            <p>"Coming together is the beginning, keeping together is progress, and working together is success."</p>
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="structure-section glass section-padding">
        <div className="structure-content">
          <h2>Our Structure</h2>
          <p>Samashti is organized into specialized departments to ensure seamless coordination and maximum student engagement.</p>
          <div className="dept-grid">
            <div className="dept-item">
              <strong>Organising</strong>
              <span>Planning, logistics, and documentation.</span>
            </div>
            <div className="dept-item">
              <strong>Cultural</strong>
              <span>Music, Dance, Fashion, Theatre, and Fine Arts.</span>
            </div>
            <div className="dept-item">
              <strong>PR & Marketing</strong>
              <span>Outreach, communication, and promotional campaigns.</span>
            </div>
            <div className="dept-item">
              <strong>Finance</strong>
              <span>Budgeting, sponsorship, and financial planning.</span>
            </div>
            <div className="dept-item">
              <strong>Technical</strong>
              <span>Digital platforms, sound, and lighting execution.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

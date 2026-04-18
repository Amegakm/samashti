import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { submitApplication } from '../firebase/services';
import './Recruitment.css';

const Recruitment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    forum: '',
    reason: '',
  });

  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitApplication(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', department: '', forum: '', reason: '' });
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (status === 'success') {
    return (
      <div className="recruitment-page container section-padding success-view">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle size={80} color="var(--accent)" />
          <h1>Application Received!</h1>
          <p>Thank you for applying to Samashti. Our team will review your application and get back to you soon.</p>
          <button className="primary-btn" onClick={() => setStatus('idle')}>Submit Another</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="recruitment-page container section-padding">
      <div className="recruitment-content">
        <motion.div 
          className="recruitment-info"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1>Join Samashti</h1>
          <p>Be a part of the official student council. Lead, innovate, and drive change across the campus.</p>
          
          <ul className="perks">
            <li>Develop leadership skills</li>
            <li>Organize massive university fests</li>
            <li>Connect with top industrial leaders</li>
            <li>Represent your department</li>
          </ul>
        </motion.div>

        <motion.form 
          className="recruitment-form glass"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 00000 00000" />
            </div>
          </div>
          <div className="form-group">
            <label>Department / Major</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required placeholder="Computer Science" />
          </div>
          <div className="form-group">
            <label>Forum / Interest Group</label>
            <input type="text" name="forum" value={formData.forum} onChange={handleChange} required placeholder="e.g. Photography, Coding, etc." />
          </div>
          <div className="form-group">
            <label>Why do you want to join Samashti?</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} required placeholder="Tell us about your passion..."></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
          </button>
          
          {status === 'error' && <p className="error-msg">Something went wrong. Please try again.</p>}
        </motion.form>
      </div>
    </div>
  );
};

export default Recruitment;

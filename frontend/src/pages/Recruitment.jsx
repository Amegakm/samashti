import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { submitApplication, subscribeToRecruitmentConfig } from '../firebase/services';
import './Recruitment.css';
import { useEffect } from 'react';

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
  const [config, setConfig] = useState({ departments: [], forums: [] });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const unsub = subscribeToRecruitmentConfig(
      (data) => setConfig(data),
      (err) => console.error(err)
    );
    return unsub;
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain alphabets';
      isValid = false;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number can only contain numbers';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setStatus('submitting');
    try {
      await submitApplication(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', department: '', forum: '', reason: '' });
      setFormErrors({});
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
            {formErrors.name && <span className="field-error">{formErrors.name}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
              {formErrors.email && <span className="field-error">{formErrors.email}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="9876543210" />
              {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Department</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {config.departments.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Forum</label>
            <select name="forum" value={formData.forum} onChange={handleChange} required>
              <option value="">Select Forum</option>
              {config.forums.map((f, i) => (
                <option key={i} value={f}>{f}</option>
              ))}
            </select>
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

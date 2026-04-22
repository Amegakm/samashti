import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, MessageSquare } from 'lucide-react';
import { submitFeedback } from '../firebase/services';
import './Feedback.css';

const Feedback = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFeedback = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitFeedback(form);
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Could not send feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page section-padding">
      <div className="container">
        <motion.div
          className="feedback-page-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Page Header */}
          <div className="feedback-page-header">
            <div className="feedback-icon-wrap">
              <MessageSquare size={32} />
            </div>
            <div>
              <h1 className="feedback-page-title">Share Your Feedback</h1>
              <p className="feedback-page-subtitle">
                We'd love to hear from you. Your thoughts help Samashti grow and improve for everyone.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="feedback-success glass"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle size={48} className="feedback-check-icon" />
                <h2>Thank you for your feedback!</h2>
                <p>Your message has been received. We really appreciate you taking the time to share your thoughts.</p>
                <button
                  className="primary-btn"
                  onClick={() => setSubmitted(false)}
                  style={{ marginTop: '1.5rem' }}
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="feedback-card glass"
                onSubmit={handleFeedback}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="feedback-form-row">
                  <div className="feedback-field">
                    <label htmlFor="fb-name">Your Name</label>
                    <input
                      id="fb-name"
                      type="text"
                      placeholder="e.g. Aryan Sharma"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="feedback-field">
                    <label htmlFor="fb-email">Email Address</label>
                    <input
                      id="fb-email"
                      type="email"
                      placeholder="e.g. aryan@jainuniversity.ac.in"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="feedback-field">
                  <label htmlFor="fb-message">Your Message</label>
                  <textarea
                    id="fb-message"
                    placeholder="Share your thoughts, suggestions, or experience with Samashti..."
                    rows={6}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                {error && <p className="feedback-error">{error}</p>}

                <button
                  type="submit"
                  className="primary-btn feedback-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : <><Send size={16} /> Send Feedback</>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;

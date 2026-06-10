import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { subscribeToJuyfEvents, subscribeToJuyfInfo } from '../firebase/services';
import './JUYF.css';

const JUYF = () => {
  const [events, setEvents] = useState([]);
  const [juyfInfo, setJuyfInfo] = useState({ name: 'JAIN UNIVERSITY YOUTH FESTIVAL', dates: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubEvents = subscribeToJuyfEvents(
      (data) => {
        setEvents(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    const unsubInfo = subscribeToJuyfInfo(
      (data) => setJuyfInfo(data),
      () => {}
    );
    return () => {
      unsubEvents();
      unsubInfo();
    };
  }, []);

  return (
    <div className="juyf-page container section-padding">
      <motion.div
        className="juyf-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="juyf-badge">Internal College Fest</span>
        <h1>{juyfInfo.name || 'JUYF'}</h1>
        {juyfInfo.dates && (
          <div className="juyf-dates">
            <Calendar size={18} />
            <span>{juyfInfo.dates}</span>
          </div>
        )}
        <p className="juyf-description">
          Experience the ultimate celebration of talent, culture, and sports at Jain University.
        </p>
      </motion.div>

      {loading ? (
        <div className="loader">Organizing events...</div>
      ) : (
        <motion.div
          className="juyf-events-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {events.length === 0 ? (
            <div className="no-data-card glass">
              <h3>Stay Tuned!</h3>
              <p>The schedule for upcoming internal fests will be here soon.</p>
            </div>
          ) : (
            <div className="juyf-grid">
              {events.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  className="juyf-card glass"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="juyf-card-header">
                    <h3>{ev.name}</h3>
                    <span className="juyf-card-date">{ev.date}</span>
                  </div>
                  
                  {ev.description && <p className="juyf-card-desc">{ev.description}</p>}
                  
                  <div className="juyf-card-footer">
                    {ev.brochure ? (
                      <a
                        href={ev.brochure}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brochure-cool-btn"
                      >
                        <FileText size={18} />
                        <span>Rules & Details</span>
                      </a>
                    ) : (
                      <span className="juyf-placeholder">More details soon</span>
                    )}
                    
                    {ev.regLink && (
                      <a href={ev.regLink} target="_blank" rel="noopener noreferrer" className="juyf-reg-link">
                        Register <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default JUYF;

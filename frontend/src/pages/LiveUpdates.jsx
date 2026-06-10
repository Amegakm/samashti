import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Bell } from 'lucide-react';
import { subscribeToAnnouncements } from '../firebase/services';
import './LiveUpdates.css';

const LiveUpdates = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements((data) => {
      setAnnouncements(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="live-page container section-padding">
      <div className="live-header">
        <div className="live-badge">
          <div className="pulse"></div>
          LIVE
        </div>
        <h1>Campus Announcements</h1>
        <p>Stay updated with the latest happenings at Samashti.</p>
      </div>

      <div className="announcements-list">
        <AnimatePresence>
          {announcements.length === 0 ? (
            <motion.div 
              className="empty-live glass"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Bell size={48} className="dim-icon" />
              <p>No new updates at the moment. Check back soon!</p>
            </motion.div>
          ) : (
            announcements.map((item, i) => (
              <motion.div 
                key={item.id}
                className="announcement-card glass"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="announcement-meta">
                  <span className="announcement-type">{item.type || 'General'}</span>
                  <span className="announcement-date">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                {item.link && (
                  <a href={item.link} className="announcement-link">Learn More</a>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveUpdates;

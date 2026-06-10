import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subscribeToHallOfFame } from '../firebase/services';
import './HallOfFame.css';

// Shows initials avatar when image fails to load
const HofImage = ({ src, name }) => {
  const [broken, setBroken] = useState(false);
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (!src || broken) {
    return (
      <div className="hof-avatar">
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="hof-image"
      onError={() => setBroken(true)}
    />
  );
};

const HallOfFame = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToHallOfFame((data) => {
      setEntries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="hof-page container section-padding">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hof-header"
      >
        <h1>Hall of Fame</h1>
        <p>A tribute to the extraordinary students who have made Samashti proud.</p>
      </motion.div>

      {loading ? (
        <div className="loader">Loading brilliance...</div>
      ) : (
        <div className="hof-grid">
          {entries.length === 0 ? (
            <div className="empty-state glass">
              <p>No entries found yet. The greatness is being recorded.</p>
            </div>
          ) : (
            entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                className="hof-card glass"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="hof-img-container">
                  <HofImage src={entry.image} name={entry.name} />
                </div>
                <div className="hof-info">
                  <h3>{entry.name}</h3>
                  {entry.year && <div className="hof-year">{entry.year}</div>}
                  <p>{entry.achievement}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HallOfFame;

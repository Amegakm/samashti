import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subscribeToGallery } from '../firebase/services';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToGallery((data) => {
      setImages(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <div className="gallery-page container section-padding">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gallery-header"
      >
        <h1>Gallery</h1>
        <p>Capturing the vibrant spirit of Samashti through the lens.</p>
      </motion.div>

      {loading ? (
        <div className="loader">Loading moments...</div>
      ) : (
        <div className="gallery-grid">
          {images.length === 0 && <p className="no-data">No memories captured yet.</p>}
          {images.map((img, i) => (
            <motion.div 
              key={img.id}
              className="gallery-item glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="gallery-img-wrapper">
                <img src={img.url} alt={img.title} />
                <div className="gallery-overlay">
                  <span>{img.title}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;

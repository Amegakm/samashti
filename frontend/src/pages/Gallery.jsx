import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeToGallery } from '../firebase/services';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForum, setSelectedForum] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsub = subscribeToGallery((data) => {
      setImages(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Group images by forum
  const forums = images.reduce((acc, img) => {
    const forum = img.forum || 'General';
    if (!acc[forum]) acc[forum] = [];
    acc[forum].push(img);
    return acc;
  }, {});

  const openSlideshow = (forumName) => {
    setSelectedForum(forumName);
    setCurrentIndex(0);
  };

  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    const forumImages = forums[selectedForum];
    setCurrentIndex((prev) => (prev + 1) % forumImages.length);
  };

  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    const forumImages = forums[selectedForum];
    setCurrentIndex((prev) => (prev - 1 + forumImages.length) % forumImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedForum) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setSelectedForum(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedForum]);

  return (
    <div className="gallery-page container section-padding">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gallery-header"
      >
        <h1>Gallery</h1>
        <p>Capturing the vibrant spirit of Samashti through the lens.</p>
      </motion.div>

      {loading ? (
        <div className="loader">Loading moments...</div>
      ) : (
        <div className="gallery-grid">
          {Object.keys(forums).length === 0 && <p className="no-data">No memories captured yet.</p>}
          {Object.entries(forums).map(([name, imgs], i) => (
            <motion.div 
              key={name}
              className="gallery-item glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => openSlideshow(name)}
            >
              <div className="gallery-img-wrapper">
                <img src={imgs[0].url} alt={name} />
                <div className="gallery-info">
                   <h3 className="forum-title">{name}</h3>
                   <span className="photo-count">{imgs.length} Photos</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Slideshow Modal */}
      <AnimatePresence>
        {selectedForum && (
          <motion.div 
            className="slideshow-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedForum(null)}
          >
            <motion.button 
              className="close-btn" 
              onClick={() => setSelectedForum(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={32} />
            </motion.button>

            <div className="slideshow-content" onClick={e => e.stopPropagation()}>
              <button className="nav-btn prev" onClick={prevSlide}>
                <ChevronLeft size={40} />
              </button>

              <div className="slide-container">
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={forums[selectedForum][currentIndex].id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="slide-image-wrapper"
                  >
                    <img src={forums[selectedForum][currentIndex].url} alt={selectedForum} />
                    <div className="slide-caption">
                       <h3>{forums[selectedForum][currentIndex].description}</h3>
                       <p>{selectedForum} — {currentIndex + 1} of {forums[selectedForum].length}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button className="nav-btn next" onClick={nextSlide}>
                <ChevronRight size={40} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeToResults } from '../firebase/services';
import './Results.css';

// ── Per-year horizontal carousel ─────────────────────────────────────────────
const YearCarousel = ({ year, items }) => {
  const [index, setIndex] = useState(0);
  const total = items.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  // Show up to 3 visible cards; centre is the active one
  const visible = [-1, 0, 1].map((offset) => {
    const idx = (index + offset + total) % total;
    return { item: items[idx], offset };
  });

  return (
    <section className="results-year-section">
      <h2 className="results-year-title">{year}</h2>

      <div className="carousel-wrapper">
        {/* Left Arrow */}
        <button className="carousel-arrow left" onClick={prev}>
          <ChevronLeft size={28} />
        </button>

        {/* Cards */}
        <div className="carousel-track">
          {visible.map(({ item, offset }) => (
            <motion.div
              key={`${item.id}-${offset}`}
              className={`result-card glass ${offset === 0 ? 'active' : 'side'}`}
              layout
              animate={{ opacity: offset === 0 ? 1 : 0.45, scale: offset === 0 ? 1 : 0.88 }}
              transition={{ duration: 0.35 }}
            >
              <div className="result-card-img-wrap">
                <img src={item.url} alt={item.name} />
              </div>
              <div className="result-card-info">
                <strong>{item.name}</strong>
                <span>{item.title}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <button className="carousel-arrow right" onClick={next}>
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Dots */}
      <div className="carousel-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToResults(
      (data) => { setResults(data); setLoading(false); },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const byYear = results.reduce((acc, r) => {
    const yr = r.year || 'Other';
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(r);
    return acc;
  }, {});

  const sortedYears = Object.keys(byYear).sort((a, b) => b - a);

  return (
    <div className="results-page container section-padding">
      <motion.div
        className="results-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="results-icon-wrap">
          <Trophy size={36} />
        </div>
        <h1>Event Results</h1>
        <p>Official results from Samskritika events, grouped by year.</p>
      </motion.div>

      {loading ? (
        <p className="results-loading">Loading results...</p>
      ) : sortedYears.length === 0 ? (
        <motion.div className="results-empty glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Trophy size={48} className="results-empty-icon" />
          <h2>No Results Yet</h2>
          <p>Results will be published here once the events conclude. Stay tuned!</p>
        </motion.div>
      ) : (
        sortedYears.map((year) => (
          <YearCarousel key={year} year={year} items={byYear[year]} />
        ))
      )}
    </div>
  );
};

export default Results;

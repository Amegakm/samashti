import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { subscribeToFestEvents, subscribeToFestInfo } from '../firebase/services';
import './Fest.css';

const Fest = () => {
  const [events, setEvents] = useState([]);
  const [festInfo, setFestInfo] = useState({ name: '', dates: '' });

  useEffect(() => {
    const unsubEvents = subscribeToFestEvents(
      (data) => setEvents(data),
      () => {}
    );
    const unsubInfo = subscribeToFestInfo(
      (data) => setFestInfo(data),
      () => {}
    );
    return () => {
      unsubEvents();
      unsubInfo();
    };
  }, []);

  return (
    <div className="fest-page container section-padding">
      <motion.div
        className="fest-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {festInfo.name && <h1>{festInfo.name}</h1>}
        {festInfo.dates && <p className="fest-dates">{festInfo.dates}</p>}
        {(festInfo.name || festInfo.dates) && (
          <p>Explore the events and download the brochures below.</p>
        )}
      </motion.div>

      <motion.div
        className="fest-events-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {events.length === 0 ? (
          <p className="no-data">Event details are coming soon.</p>
        ) : (
          <div className="events-table-wrapper glass">
            <table className="events-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Brochure</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => (
                  <motion.tr
                    key={ev.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="ev-num">{i + 1}</td>
                    <td className="ev-name">{ev.name}</td>
                    <td className="ev-date">{ev.date}</td>
                    <td className="ev-brochure">
                      {ev.brochure ? (
                        <a
                          href={ev.brochure}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="brochure-link"
                        >
                          <FileText size={16} />
                          View Brochure
                        </a>
                      ) : (
                        <span className="no-brochure">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Fest;

import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Image as ImageIcon, Bell, FileText, LogOut, Trash2, CheckCircle, Eye, EyeOff, PartyPopper, AlertCircle, ExternalLink, MessageSquare } from 'lucide-react';
import {
  subscribeToHallOfFame, addHallOfFameEntry, deleteHallOfFameEntry,
  subscribeToGallery, addGalleryItem, deleteGalleryItem,
  subscribeToAnnouncements, addAnnouncement, deleteAnnouncement,
  subscribeToApplications, deleteApplication,
  subscribeToFestEvents, addFestEvent, deleteFestEvent,
  subscribeToFestInfo, updateFestInfo,
  subscribeToJuyfEvents, addJuyfEvent, deleteJuyfEvent,
  subscribeToJuyfInfo, updateJuyfInfo,
  subscribeToRecruitmentConfig, updateRecruitmentConfig,
  subscribeToFeedback, deleteFeedback
} from '../firebase/services';
import ImageUploader from '../components/ImageUploader';
import FileUploader from '../components/FileUploader';
import './Admin.css';

// ── Reusable toast ──────────────────────────────────────────────────────────
const Toast = ({ msg, type }) => (
  <motion.div
    className={`admin-toast ${type}`}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
  >
    {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
    {msg}
  </motion.div>
);

const useToast = () => {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
};

// ── Hall of Fame ────────────────────────────────────────────────────────────
const HOFManager = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ name: '', achievement: '', year: '', image: '' });
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    const unsub = subscribeToHallOfFame(
      (data) => setEntries(data),
      (err) => show(`Read error: ${err.message}`, 'error')
    );
    return unsub;
  }, [show]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addHallOfFameEntry(newEntry);
      setNewEntry({ name: '', achievement: '', year: '', image: '' });
      show('Entry added! It will appear on the website immediately.');
    } catch (err) {
      show(`Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHallOfFameEntry(id);
      show('Entry deleted.');
    } catch (err) {
      show(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="manager-section">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
      <form className="admin-form glass" onSubmit={handleAdd}>
        <h3>Add to Hall of Fame</h3>
        <input type="text" placeholder="Full Name" value={newEntry.name} onChange={e => setNewEntry({...newEntry, name: e.target.value})} required />
        <input type="text" placeholder="Achievement / Title" value={newEntry.achievement} onChange={e => setNewEntry({...newEntry, achievement: e.target.value})} required />
        <input type="text" placeholder="Year (e.g. 2025)" value={newEntry.year} onChange={e => setNewEntry({...newEntry, year: e.target.value})} />
        <label className="upload-label">Photo</label>
        <ImageUploader
          folder="hall_of_fame"
          onUploaded={(url) => setNewEntry(prev => ({...prev, image: url}))}
        />
        <button type="submit" className="primary-btn" disabled={saving || !newEntry.name || !newEntry.achievement}>
          {saving ? 'Saving to Firebase...' : 'Add Entry'}
        </button>
      </form>
      <div className="admin-list">
        {entries.length === 0 && <p className="list-empty">No entries yet. Add one above.</p>}
        {entries.map(e => (
          <div key={e.id} className="admin-list-item glass">
            {e.image && <img src={e.image} alt={e.name} className="list-thumb" />}
            <span><strong>{e.name}</strong> — {e.achievement} {e.year && `(${e.year})`}</span>
            <button onClick={() => handleDelete(e.id)} className="delete-icon"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Gallery ─────────────────────────────────────────────────────────────────
const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ description: '', url: '', forum: '' });
  const [config, setConfig] = useState({ departments: [], forums: [] });
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    const unsubGallery = subscribeToGallery(
      (data) => setItems(data),
      (err) => show(`Read error: ${err.message}`, 'error')
    );
    const unsubConfig = subscribeToRecruitmentConfig(
      (data) => setConfig(data),
      () => {}
    );
    return () => { unsubGallery(); unsubConfig(); };
  }, [show]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addGalleryItem(newItem);
      setNewItem({ description: '', url: '', forum: '' });
      show('Photo added! It will appear in the Gallery immediately.');
    } catch (err) {
      show(`Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGalleryItem(id);
      show('Photo deleted.');
    } catch (err) {
      show(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="manager-section">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
      <form className="admin-form glass" onSubmit={handleAdd}>
        <h3>Add to Gallery</h3>
        <select
          value={newItem.forum}
          onChange={e => setNewItem({...newItem, forum: e.target.value})}
          required
        >
          <option value="" disabled>Select Forum / Category</option>
          {config.forums.map((f, i) => (
            <option key={i} value={f}>{f}</option>
          ))}
        </select>
        <textarea placeholder="Photo Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} required />
        <label className="upload-label">Photo</label>
        <ImageUploader
          folder="gallery"
          onUploaded={(url) => setNewItem(prev => ({...prev, url}))}
        />
        <button type="submit" className="primary-btn" disabled={saving || !newItem.forum || !newItem.url}>
          {saving ? 'Saving to Firebase...' : 'Add Photo'}
        </button>
      </form>
      <div className="admin-list">
        {items.length === 0 && <p className="list-empty">No photos yet. Add one above.</p>}
        {items.map(i => (
          <div key={i.id} className="admin-list-item glass">
            {i.url && <img src={i.url} alt={i.forum} className="list-thumb" />}
            <div className="list-info">
              <strong>{i.forum}</strong>
              <span className="list-sub">{i.description}</span>
            </div>
            <button onClick={() => handleDelete(i.id)} className="delete-icon"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Live Updates / Announcements ────────────────────────────────────────────
const AnnouncementManager = () => {
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState({ title: '', content: '', type: 'General', link: '' });
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    const unsub = subscribeToAnnouncements(
      (data) => setMsgs(data),
      (err) => show(`Read error: ${err.message}`, 'error')
    );
    return unsub;
  }, [show]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addAnnouncement(newMsg);
      setNewMsg({ title: '', content: '', type: 'General', link: '' });
      show('Announcement published! Visible on Live Updates now.');
    } catch (err) {
      show(`Failed to publish: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      show('Announcement deleted.');
    } catch (err) {
      show(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="manager-section">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
      <form className="admin-form glass" onSubmit={handleAdd}>
        <h3>Post Live Update</h3>
        <input type="text" placeholder="Title (e.g. Result Announced!)" value={newMsg.title} onChange={e => setNewMsg({...newMsg, title: e.target.value})} required />
        <textarea placeholder="Announcement body..." value={newMsg.content} onChange={e => setNewMsg({...newMsg, content: e.target.value})} required />
        <select value={newMsg.type} onChange={e => setNewMsg({...newMsg, type: e.target.value})}>
          <option value="General">General</option>
          <option value="Fest">Fest</option>
        </select>
        <input type="url" placeholder="Link URL (optional)" value={newMsg.link} onChange={e => setNewMsg({...newMsg, link: e.target.value})} />
        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? 'Publishing to Firebase...' : 'Publish'}
        </button>
      </form>
      <div className="admin-list">
        {msgs.length === 0 && <p className="list-empty">No announcements yet.</p>}
        {msgs.map(m => (
          <div key={m.id} className="admin-list-item glass">
            <div className="list-info">
              <strong>{m.title}</strong>
              <span className="list-sub">{m.content}</span>
            </div>
            <button onClick={() => handleDelete(m.id)} className="delete-icon"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Fest Events ─────────────────────────────────────────────────────────────
const FestEventsManager = () => {
  const [events, setEvents] = useState([]);
  const [festInfo, setFestInfo] = useState({ name: '', dates: '' });
  const [infoSaving, setInfoSaving] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', brochure: '' });
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    const unsubEvents = subscribeToFestEvents(
      (data) => setEvents(data),
      (err) => show(`Read error: ${err.message}`, 'error')
    );
    const unsubInfo = subscribeToFestInfo(
      (data) => setFestInfo({ name: data.name || '', dates: data.dates || '' }),
      () => {}
    );
    return () => { unsubEvents(); unsubInfo(); };
  }, [show]);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setInfoSaving(true);
    try {
      await updateFestInfo(festInfo);
      show('Fest header updated! Changes are live on the Fest page.');
    } catch (err) {
      show(`Failed to save: ${err.message}`, 'error');
    } finally {
      setInfoSaving(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addFestEvent(newEvent);
      setNewEvent({ name: '', date: '', brochure: '' });
      show('Event added! It will appear on the Fest page immediately.');
    } catch (err) {
      show(`Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFestEvent(id);
      show('Event deleted.');
    } catch (err) {
      show(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="fest-events-manager-wrapper">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      {/* ── Fest Page Header ── */}
      <form className="fest-info-card glass" onSubmit={handleSaveInfo}>
        <div className="fest-info-header">
          <PartyPopper size={20} />
          <h3>Fest Page Header</h3>
        </div>
        <p className="fest-info-hint">This sets the title and dates shown at the top of the Fest page.</p>
        <div className="fest-info-fields">
          <div className="form-group">
            <label>Fest Name</label>
            <input
              type="text"
              placeholder="e.g. Samskritika 2026"
              value={festInfo.name}
              onChange={e => setFestInfo({ ...festInfo, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Dates</label>
            <input
              type="text"
              placeholder="e.g. February 16, 17, and 18, 2026"
              value={festInfo.dates}
              onChange={e => setFestInfo({ ...festInfo, dates: e.target.value })}
            />
          </div>
          <button type="submit" className="primary-btn fest-info-save-btn" disabled={infoSaving}>
            <CheckCircle size={15} /> {infoSaving ? 'Saving...' : 'Save Header'}
          </button>
        </div>
      </form>

      {/* ── Events section ── */}
      <div className="fest-events-manager">
        {/* Add Form */}
        <form className="admin-form glass fest-event-form" onSubmit={handleAdd}>
          <h3>Add Fest Event</h3>
          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              placeholder="e.g. Classical Dance Competition"
              value={newEvent.name}
              onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="text"
              placeholder="e.g. February 16, 2026"
              value={newEvent.date}
              onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="upload-label">Brochure (Image/PDF)</label>
            <FileUploader
              folder="brochures"
              accept="image/*,application/pdf"
              hint="JPG, PNG, WEBP, PDF — max 20MB"
              onUploaded={(url) => setNewEvent({ ...newEvent, brochure: url })}
            />
            <div className="manual-link-field">
              <span>OR Paste Link (e.g. Google Drive)</span>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={newEvent.brochure}
                onChange={e => setNewEvent({ ...newEvent, brochure: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="primary-btn" disabled={saving || !newEvent.name || !newEvent.date}>
            {saving ? 'Saving...' : 'Add Event'}
          </button>
        </form>

        {/* Events Table */}
        <div className="events-admin-table-wrapper glass">
          <h3 className="events-table-title">All Events</h3>
          {events.length === 0 ? (
            <p className="list-empty">No events yet. Add one above.</p>
          ) : (
            <table className="events-admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Brochure</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => (
                  <tr key={ev.id}>
                    <td className="eadmin-num">{i + 1}</td>
                    <td className="eadmin-name">{ev.name}</td>
                    <td className="eadmin-date">{ev.date}</td>
                    <td className="eadmin-brochure">
                      {ev.brochure ? (
                        <a href={ev.brochure} target="_blank" rel="noopener noreferrer" className="brochure-admin-link">
                          <ExternalLink size={14} /> View
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleDelete(ev.id)} className="delete-icon">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// ── JUYF Events (Internal) ──────────────────────────────────────────────────
const JUYFEventsManager = () => {
  const [events, setEvents] = useState([]);
  const [juyfInfo, setJuyfInfo] = useState({ name: '', dates: '' });
  const [infoSaving, setInfoSaving] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', brochure: '', description: '', regLink: '' });
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    const unsubEvents = subscribeToJuyfEvents(
      (data) => setEvents(data),
      (err) => show(`Read error: ${err.message}`, 'error')
    );
    const unsubInfo = subscribeToJuyfInfo(
      (data) => setJuyfInfo({ name: data.name || '', dates: data.dates || '' }),
      () => {}
    );
    return () => { unsubEvents(); unsubInfo(); };
  }, [show]);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setInfoSaving(true);
    try {
      await updateJuyfInfo(juyfInfo);
      show('JUYF header updated!');
    } catch (err) {
      show(`Failed to save: ${err.message}`, 'error');
    } finally {
      setInfoSaving(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addJuyfEvent(newEvent);
      setNewEvent({ name: '', date: '', brochure: '', description: '', regLink: '' });
      show('Internal fest event added!');
    } catch (err) {
      show(`Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJuyfEvent(id);
      show('Event deleted.');
    } catch (err) {
      show(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="fest-events-manager-wrapper">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      <form className="fest-info-card glass" onSubmit={handleSaveInfo}>
        <div className="fest-info-header">
          <PartyPopper size={20} />
          <h3>JUYF Page Header</h3>
        </div>
        <div className="fest-info-fields">
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={juyfInfo.name} onChange={e => setJuyfInfo({ ...juyfInfo, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Main Dates</label>
            <input type="text" value={juyfInfo.dates} onChange={e => setJuyfInfo({ ...juyfInfo, dates: e.target.value })} />
          </div>
          <button type="submit" className="primary-btn fest-info-save-btn" disabled={infoSaving}>
            <CheckCircle size={15} /> {infoSaving ? 'Saving...' : 'Save Header'}
          </button>
        </div>
      </form>

      <div className="fest-events-manager">
        <form className="admin-form glass fest-event-form" onSubmit={handleAdd}>
          <h3>Add Event to JUYF</h3>
          <input type="text" placeholder="Event Name" value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} required />
          <input type="text" placeholder="Date/Time" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} required />
          <textarea placeholder="Brief Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
          <input type="url" placeholder="Registration Link (optional)" value={newEvent.regLink} onChange={e => setNewEvent({ ...newEvent, regLink: e.target.value })} />
          <div className="form-group">
            <label className="upload-label">Rules Brochure (Image/PDF)</label>
            <FileUploader 
              folder="brochures" 
              accept="image/*,application/pdf" 
              hint="JPG, PNG, WEBP, PDF — max 20MB"
              onUploaded={(url) => setNewEvent({ ...newEvent, brochure: url })} 
            />
            <div className="manual-link-field">
              <span>OR Paste Link (e.g. Google Drive)</span>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={newEvent.brochure}
                onChange={e => setNewEvent({ ...newEvent, brochure: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="primary-btn" disabled={saving}>
            {saving ? 'Adding...' : 'Add JUYF Event'}
          </button>
        </form>

        <div className="events-admin-table-wrapper glass">
          <h3 className="events-table-title">JUYF Events</h3>
          {events.length === 0 ? <p className="list-empty">No events yet.</p> : (
            <table className="events-admin-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.name}</td>
                    <td>{ev.date}</td>
                    <td><button onClick={() => handleDelete(ev.id)} className="delete-icon"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Recruitment Applications ────────────────────────────────────────────────
const RecruitmentManager = () => {
  const [apps, setApps] = useState([]);
  const { toast, show } = useToast();

  useEffect(() => {
    const unsub = subscribeToApplications(
      (data) => setApps(data),
      (err) => show(`Read error: ${err.message}`, 'error')
    );
    return unsub;
  }, [show]);

  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
      show('Application deleted.');
    } catch (err) {
      show(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="manager-section full-width-section">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
      <div className="admin-list full-width">
        {apps.length === 0 && <p className="list-empty">No applications received yet.</p>}
        {apps.map(a => (
          <div key={a.id} className="app-card glass">
            <div className="app-header">
              <strong>{a.name}</strong>
              <button onClick={() => handleDelete(a.id)} className="delete-btn"><Trash2 size={18} /></button>
            </div>
            <p><strong>Dept:</strong> {a.department}</p>
            <p><strong>Forum:</strong> {a.forum}</p>
            <p><strong>Email:</strong> {a.email}</p>
            <p><strong>Phone:</strong> {a.phone}</p>
            <p className="app-reason">"{a.reason}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Recruitment Configuration (Dropdown Options) ────────────────────────────
const RecruitmentConfigManager = () => {
  const [config, setConfig] = useState({ departments: [], forums: [] });
  const [newDept, setNewDept] = useState('');
  const [newForum, setNewForum] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    const unsub = subscribeToRecruitmentConfig(
      (data) => setConfig(data),
      (err) => show(`Read error: ${err.message}`, 'error')
    );
    return unsub;
  }, [show]);

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!newDept.trim()) return;
    setSaving(true);
    try {
      const updatedDepts = [...config.departments, newDept.trim()];
      await updateRecruitmentConfig({ ...config, departments: updatedDepts });
      setNewDept('');
      show('Department added!');
    } catch (err) {
      show(`Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddForum = async (e) => {
    e.preventDefault();
    if (!newForum.trim()) return;
    setSaving(true);
    try {
      const updatedForums = [...config.forums, newForum.trim()];
      await updateRecruitmentConfig({ ...config, forums: updatedForums });
      setNewForum('');
      show('Forum added!');
    } catch (err) {
      show(`Failed to save: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (type, index) => {
    try {
      const updated = { ...config };
      updated[type] = config[type].filter((_, i) => i !== index);
      await updateRecruitmentConfig(updated);
      show('Item removed.');
    } catch (err) {
      show(`Remove failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="recruitment-config-manager">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
      
      <div className="config-grid">
        {/* Departments */}
        <div className="config-section glass">
          <h3>Manage Departments</h3>
          <form className="config-add-form" onSubmit={handleAddDept}>
            <input 
              type="text" 
              placeholder="e.g. Computer Science" 
              value={newDept} 
              onChange={e => setNewDept(e.target.value)} 
            />
            <button type="submit" className="primary-btn" disabled={saving}>Add</button>
          </form>
          <div className="config-list">
            {config.departments.map((d, i) => (
              <div key={i} className="config-item">
                <span>{d}</span>
                <button onClick={() => removeItem('departments', i)} className="delete-icon"><Trash2 size={14} /></button>
              </div>
            ))}
            {config.departments.length === 0 && <p className="list-empty">No departments added.</p>}
          </div>
        </div>

        {/* Forums */}
        <div className="config-section glass">
          <h3>Manage Forums</h3>
          <form className="config-add-form" onSubmit={handleAddForum}>
            <input 
              type="text" 
              placeholder="e.g. Photography Forum" 
              value={newForum} 
              onChange={e => setNewForum(e.target.value)} 
            />
            <button type="submit" className="primary-btn" disabled={saving}>Add</button>
          </form>
          <div className="config-list">
            {config.forums.map((f, i) => (
              <div key={i} className="config-item">
                <span>{f}</span>
                <button onClick={() => removeItem('forums', i)} className="delete-icon"><Trash2 size={14} /></button>
              </div>
            ))}
            {config.forums.length === 0 && <p className="list-empty">No forums added.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Feedback Manager ────────────────────────────────────────────────────────
const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const { toast, show } = useToast();

  useEffect(() => {
    const unsub = subscribeToFeedback(
      (data) => setFeedbacks(data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))),
      (err) => show(`Read error: ${err.message}`, 'error')
    );
    return unsub;
  }, [show]);

  const handleDelete = async (id) => {
    try {
      await deleteFeedback(id);
      show('Feedback deleted.');
    } catch (err) {
      show(`Delete failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="manager-section full-width-section">
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>
      <div className="admin-list full-width">
        {feedbacks.length === 0 && <p className="list-empty">No feedback received yet.</p>}
        {feedbacks.map(f => (
          <div key={f.id} className="app-card glass feedback-card">
            <div className="app-header">
              <div className="app-header-left">
                <strong>{f.name}</strong>
                <span className="app-date">{f.submittedAt ? new Date(f.submittedAt).toLocaleString() : 'No date'}</span>
              </div>
              <button onClick={() => handleDelete(f.id)} className="delete-btn"><Trash2 size={18} /></button>
            </div>
            <p><strong>Email:</strong> {f.email}</p>
            <div className="feedback-message-box">
              <p className="app-reason">"{f.message}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Dashboard Shell ─────────────────────────────────────────────────────────
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('HOF');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin');
  };

  const tabs = [
    { id: 'HOF',     label: 'Hall of Fame',   icon: <Users size={18} /> },
    { id: 'Gallery', label: 'Gallery',         icon: <ImageIcon size={18} /> },
    { id: 'Live',    label: 'Announcements',   icon: <Bell size={18} /> },
    { id: 'Fest',    label: 'Fest Events',     icon: <PartyPopper size={18} /> },
    { id: 'JUYF',    label: 'JUYF (Internal)', icon: <CheckCircle size={18} /> },
    { id: 'Apps',    label: 'Recruitment',     icon: <FileText size={18} /> },
    { id: 'Config',  label: 'Recruitment Setup', icon: <CheckCircle size={18} /> },
    { id: 'Feedback', label: 'User Feedback',   icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="admin-dashboard section-padding container">
      <div className="dashboard-header">
        <h1>Admin Control</h1>
        <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /> Logout</button>
      </div>

      <div className="dashboard-layout">
        <aside className="admin-sidebar glass">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </aside>

        <main className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'HOF'     && <HOFManager />}
              {activeTab === 'Gallery' && <GalleryManager />}
              {activeTab === 'Live'    && <AnnouncementManager />}
              {activeTab === 'Fest'    && <FestEventsManager />}
              {activeTab === 'JUYF'    && <JUYFEventsManager />}
              {activeTab === 'Apps'    && <RecruitmentManager />}
              {activeTab === 'Config'  && <RecruitmentConfigManager />}
              {activeTab === 'Feedback' && <FeedbackManager />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// ── Login ───────────────────────────────────────────────────────────────────
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      // Auto-create amegakm13@gmail.com to help setup the first admin.
      if (email === 'amegakm13@gmail.com') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
          // Ignore error, might already exist. Proceed to sign in.
        }
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials: ' + err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email first.'); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error sending reset email: ' + err.message);
    }
  };

  return (
    <div className="admin-login container section-padding">
      <motion.form className="login-form glass" onSubmit={handleLogin} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2>Admin Portal</h2>
        {error   && <p className="error">{error}</p>}
        {message && <p className="success-msg">{message}</p>}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-input-wrapper">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="login-footer">
          <button type="submit" className="primary-btn">Sign In</button>
          <button type="button" onClick={handleForgotPassword} className="forgot-btn">Forgot Password?</button>
        </div>
      </motion.form>
    </div>
  );
};

// ── Root ────────────────────────────────────────────────────────────────────
const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loader">Verifying...</div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <AdminLogin />} />
    </Routes>
  );
};

export default Admin;

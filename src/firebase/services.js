import { collection, addDoc, deleteDoc, doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './config';

// ── ImgBB Upload (For Gallery & HOF Images) ───────────────────────────
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadImage = (file, ...args) => {
  const onProgress = typeof args[0] === 'function' ? args[0] : args[1];
  
  return new Promise((resolve, reject) => {
    if (!IMGBB_API_KEY || IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY_HERE') {
      reject(new Error('ImgBB API Key missing in .env (needed for Gallery/HOF)'));
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.data.url);
      } else {
        const err = JSON.parse(xhr.responseText);
        reject(new Error('ImgBB Upload Failed: ' + (err.error?.message || xhr.statusText)));
      }
    };

    xhr.onerror = () => reject(new Error('Network Error during ImgBB upload.'));
    xhr.send(formData);
  });
};

// ── Cloudinary Upload (For Brochures/PDFs) ────────────────────────────
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error('Cloudinary credentials missing in .env (needed for Brochures)'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        const err = JSON.parse(xhr.responseText);
        reject(new Error('Cloudinary Upload Failed: ' + (err.error?.message || xhr.statusText)));
      }
    };

    xhr.onerror = () => reject(new Error('Network Error during Cloudinary upload.'));
    xhr.send(formData);
  });
};

export const uploadFileToStorage = (file, ...args) => {
  const onProgress = typeof args[0] === 'function' ? args[0] : args[1];
  return uploadToCloudinary(file, onProgress);
};

// ── Collection references ───────────────────────────────────────────────────
const hofRef = collection(db, 'hall_of_fame');
const announcementsRef = collection(db, 'announcements');
const recruitmentRef = collection(db, 'recruitment_apps');
const galleryRef = collection(db, 'gallery');
const festRef = collection(db, 'fest_clusters');
const festEventsRef = collection(db, 'fest_events');
const juyfEventsRef = collection(db, 'juyf_events');
const recruitmentConfigRef = doc(db, 'recruitment_config', 'settings');

// ── Hall of Fame ────────────────────────────────────────────────────────────
export const subscribeToHallOfFame = (onData, onError) => {
  return onSnapshot(
    hofRef,
    { includeMetadataChanges: false },
    (snapshot) => onData(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
    (err) => onError && onError(err)
  );
};

export const addHallOfFameEntry = async (entry) =>
  addDoc(hofRef, { ...entry, createdAt: new Date().toISOString() });

export const deleteHallOfFameEntry = async (id) =>
  deleteDoc(doc(db, 'hall_of_fame', id));

// ── Gallery ─────────────────────────────────────────────────────────────────
export const subscribeToGallery = (onData, onError) =>
  onSnapshot(
    galleryRef,
    (snapshot) => onData(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
    (err) => onError && onError(err)
  );

export const addGalleryItem = async (item) =>
  addDoc(galleryRef, { ...item, createdAt: new Date().toISOString() });

export const deleteGalleryItem = async (id) =>
  deleteDoc(doc(db, 'gallery', id));

// ── Announcements (Live Updates) ─────────────────────────────────────────────
export const subscribeToAnnouncements = (onData, onError) =>
  onSnapshot(
    announcementsRef,
    (snapshot) => onData(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
    (err) => onError && onError(err)
  );

export const addAnnouncement = async (content) =>
  addDoc(announcementsRef, {
    ...content,
    date: new Date().toLocaleDateString(),
    createdAt: new Date().toISOString()
  });

export const deleteAnnouncement = async (id) =>
  deleteDoc(doc(db, 'announcements', id));

// ── Fest Clusters (Samskritika) ──────────────────────────────────────────────
export const subscribeToFestClusters = (onData, onError) =>
  onSnapshot(
    festRef,
    (snapshot) => onData(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
    (err) => onError && onError(err)
  );

export const updateFestCluster = async (id, data) =>
  updateDoc(doc(db, 'fest_clusters', id), data);

// ── Recruitment ──────────────────────────────────────────────────────────────
export const submitApplication = async (app) =>
  addDoc(recruitmentRef, { ...app, submittedAt: new Date().toISOString() });

export const subscribeToApplications = (onData, onError) =>
  onSnapshot(
    recruitmentRef,
    (snapshot) => onData(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
    (err) => onError && onError(err)
  );

export const deleteApplication = async (id) =>
  deleteDoc(doc(db, 'recruitment_apps', id));

// ── Fest Events ──────────────────────────────────────────────────────────────
export const subscribeToFestEvents = (onData, onError) =>
  onSnapshot(
    festEventsRef,
    (snapshot) => onData(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
    (err) => onError && onError(err)
  );

export const addFestEvent = async (event) =>
  addDoc(festEventsRef, { ...event, createdAt: new Date().toISOString() });

export const deleteFestEvent = async (id) =>
  deleteDoc(doc(db, 'fest_events', id));

// ── Fest Info (name & dates) ─────────────────────────────────────────────────
const festInfoDocRef = doc(db, 'fest_info', 'main');

export const subscribeToFestInfo = (onData, onError) =>
  onSnapshot(
    festInfoDocRef,
    (snapshot) => onData(snapshot.exists() ? snapshot.data() : {}),
    (err) => onError && onError(err)
  );

export const updateFestInfo = async (data) =>
  setDoc(festInfoDocRef, data, { merge: true });

// ── JUYF Events (Internal) ──────────────────────────────────────────────────
export const subscribeToJuyfEvents = (onData, onError) =>
  onSnapshot(
    juyfEventsRef,
    (snapshot) => onData(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
    (err) => onError && onError(err)
  );

export const addJuyfEvent = async (event) =>
  addDoc(juyfEventsRef, { ...event, createdAt: new Date().toISOString() });

export const deleteJuyfEvent = async (id) =>
  deleteDoc(doc(db, 'juyf_events', id));

// ── JUYF Info ─────────────────────────────────────────────────────────────
const juyfInfoDocRef = doc(db, 'juyf_info', 'main');

export const subscribeToJuyfInfo = (onData, onError) =>
  onSnapshot(
    juyfInfoDocRef,
    (snapshot) => onData(snapshot.exists() ? snapshot.data() : { name: 'College Fests', dates: '' }),
    (err) => onError && onError(err)
  );

export const updateJuyfInfo = async (data) =>
  setDoc(juyfInfoDocRef, data, { merge: true });

// ── Recruitment Config (Departments & Forums) ───────────────────────────
export const subscribeToRecruitmentConfig = (onData, onError) =>
  onSnapshot(
    recruitmentConfigRef,
    (snapshot) => onData(snapshot.exists() ? snapshot.data() : { departments: [], forums: [] }),
    (err) => onError && onError(err)
  );

export const updateRecruitmentConfig = async (data) =>
  setDoc(recruitmentConfigRef, data, { merge: true });

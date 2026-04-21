import { collection, addDoc, deleteDoc, doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './config';

// ── Image Upload (ImgBB - Free Hosting) ────────────────────────────────────
// Get your free API key at: https://api.imgbb.com/
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadImage = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY_HERE') {
      reject(new Error('Please add your ImgBB API Key in services.js'));
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`);

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.data.url); // Use the direct image URL from ImgBB
      } else {
        reject(new Error('ImgBB Upload Failed: ' + xhr.statusText));
      }
    };

    xhr.onerror = () => reject(new Error('Network Error during upload'));
    xhr.send(formData);
  });
};

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

// ── File Upload (Firebase Storage for PDFs/Docs) ───────────────────
export const uploadFileToStorage = (file, folder = 'uploads', onProgress) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const uniqueName = Date.now() + '_' + file.name;
    const storageRef = ref(storage, `${folder}/${uniqueName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        if (onProgress) {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(pct);
        }
      },
      (error) => {
        reject(new Error('Firebase Upload Failed: ' + error.message));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(new Error('Failed to get URL: ' + err.message));
        }
      }
    );
  });
};

// ── Collection references ───────────────────────────────────────────────────
const hofRef = collection(db, 'hall_of_fame');
const announcementsRef = collection(db, 'announcements');
const recruitmentRef = collection(db, 'recruitment_apps');
const galleryRef = collection(db, 'gallery');
const festRef = collection(db, 'fest_clusters');
const festEventsRef = collection(db, 'fest_events');
const juyfEventsRef = collection(db, 'juyf_events');

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

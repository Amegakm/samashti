import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { uploadImage } from '../firebase/services';
import './ImageUploader.css';

/**
 * Reusable drag-and-drop / file-picker image upload component.
 * Props:
 *   onUploaded(url)  — called with the Firebase Storage download URL after upload
 *   folder           — storage folder name (e.g. 'hall_of_fame', 'gallery')
 */
const ImageUploader = ({ onUploaded, folder = 'uploads' }) => {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to Firebase Storage
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file, folder, setProgress);
      onUploaded(url);
    } catch (err) {
      setError('Upload failed: ' + err.message);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const onFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const clear = () => {
    setPreview(null);
    setProgress(0);
    setError('');
    onUploaded('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="image-uploader">
      {preview ? (
        <div className="uploader-preview">
          <img src={preview} alt="preview" />
          {uploading && (
            <div className="uploader-progress-overlay">
              <div className="uploader-progress-bar" style={{ width: `${progress}%` }} />
              <span>{progress}%</span>
            </div>
          )}
          {!uploading && (
            <button type="button" className="uploader-clear" onClick={clear}>
              <X size={16} />
            </button>
          )}
          {uploading && <p className="uploading-label">Uploading...</p>}
        </div>
      ) : (
        <div
          className={`uploader-drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            hidden
          />
          <Upload size={32} className="uploader-icon" />
          <p className="uploader-label">
            <strong>Drag & drop</strong> an image here<br />
            <span>or click to browse from your device</span>
          </p>
          <p className="uploader-hint">JPG, PNG, WEBP — max 10MB</p>
        </div>
      )}
      {error && <p className="uploader-error">{error}</p>}
    </div>
  );
};

export default ImageUploader;

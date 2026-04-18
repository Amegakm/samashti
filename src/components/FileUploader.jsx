import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { uploadFileToStorage } from '../firebase/services';
import './ImageUploader.css'; // Reusing the same CSS for consistent look

/**
 * Reusable drag-and-drop / file-picker component for generic files (like PDFs).
 * Props:
 *   onUploaded(url)  — called with the Firebase Storage download URL after upload
 *   folder           — storage folder name (e.g. 'brochures')
 *   accept           — file types to accept (e.g. 'application/pdf')
 */
const FileUploader = ({ onUploaded, folder = 'uploads', accept = '*' }) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const processFile = async (file) => {
    if (!file) return;

    // Optional validation based on 'accept' could go here, 
    // but the input already filters it in the file picker.
    
    setFileName(file.name);
    setUploading(true);
    setError('');
    
    try {
      const url = await uploadFileToStorage(file, folder, setProgress);
      onUploaded(url);
    } catch (err) {
      setError('Upload failed: ' + err.message);
      setFileName('');
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
    setFileName('');
    setProgress(0);
    setError('');
    onUploaded('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="image-uploader file-uploader">
      {fileName ? (
        <div className="uploader-preview file-preview-mode">
          <div className="file-icon-placeholder">
             <FileText size={48} color="var(--accent)" />
             <span className="file-name-display">{fileName}</span>
          </div>
          
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
            accept={accept}
            onChange={onFileChange}
            hidden
          />
          <Upload size={32} className="uploader-icon" />
          <p className="uploader-label">
            <strong>Drag & drop</strong> a file here<br />
            <span>or click to browse from your device</span>
          </p>
          <p className="uploader-hint">PDFs and Documents — max 20MB</p>
        </div>
      )}
      {error && <p className="uploader-error">{error}</p>}
    </div>
  );
};

export default FileUploader;

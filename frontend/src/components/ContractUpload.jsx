import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, X } from 'lucide-react';
import axios from 'axios';

const ContractUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a PDF or Word document (.pdf, .docx, .doc)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('/contracts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to dashboard with success message
      navigate('/dashboard', { 
        state: { message: 'Contract uploaded successfully!' }
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">Upload Contract</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div 
        className={`file-upload-area ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input').click()}
      >
        <Upload size={48} className="upload-icon" />
        <p className="upload-text">
          Drop your contract here or click to browse
        </p>
        <p className="upload-hint">
          Supports PDF, DOC, and DOCX files up to 10MB
        </p>
        <input
          id="file-input"
          type="file"
          className="file-input"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInputChange}
        />
      </div>

      {selectedFile && (
        <div className="selected-file">
          <File size={24} />
          <div className="file-info">
            <div className="file-name">{selectedFile.name}</div>
            <div className="file-size">{formatFileSize(selectedFile.size)}</div>
          </div>
          <button onClick={removeFile} className="remove-file">
            <X size={16} />
          </button>
        </div>
      )}

      <button 
        onClick={handleUpload}
        className="btn-primary"
        disabled={!selectedFile || uploading}
        style={{ marginTop: '1.5rem' }}
      >
        {uploading ? 'Uploading...' : 'Upload Contract'}
      </button>
    </div>
  );
};

export default ContractUpload;
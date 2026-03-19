/**
 * Dashboard.jsx — Main Dashboard
 * ================================
 * 
 * This is the home page after login. It shows:
 * 1. A file upload zone (drag & drop or click)
 * 2. A list of previously processed documents
 * 3. Quick stats (documents processed, pages, etc.)
 * 
 * THIS IS WHERE USERS SPEND MOST OF THEIR TIME.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument, getDocuments } from '../api';

// ============================================
// FILE UPLOAD COMPONENT
// ============================================

function FileUpload({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  
  /**
   * Handle file drop or selection.
   * This is the core upload flow.
   */
  async function handleFile(file) {
    if (!file) return;
    
    // Validate file type
    const allowed = ['pdf', 'png', 'jpg', 'jpeg', 'tiff', 'webp'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setError(`File type .${ext} not supported. Use: ${allowed.join(', ')}`);
      return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum 10MB.');
      return;
    }
    
    setError('');
    setUploading(true);
    setProgress('Uploading document...');
    
    try {
      setProgress('AI is reading your document...');
      const result = await uploadDocument(file);
      setProgress('');
      onUploadComplete(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setProgress('');
    }
  }
  
  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }
  
  function handleDragLeave() {
    setDragActive(false);
  }
  
  return (
    <div className="mb-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && document.getElementById('file-input').click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${dragActive 
            ? 'border-klarifi-400 bg-klarifi-500/5' 
            : 'border-white/10 hover:border-white/20 bg-[#111318]'}
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.tiff,.webp"
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />
        
        {uploading ? (
          <div>
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-klarifi-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-klarifi-400 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
              </svg>
            </div>
            <p className="text-klarifi-400 font-medium">{progress}</p>
            <p className="text-gray-600 text-sm mt-1">This usually takes 3-8 seconds</p>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
              📄
            </div>
            <p className="text-gray-300 font-medium mb-1">
              Drop a document here or click to upload
            </p>
            <p className="text-gray-600 text-sm">
              PDF, PNG, JPG, TIFF — up to 10MB
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}


// ============================================
// DOCUMENT LIST COMPONENT
// ============================================

function DocumentList({ documents, onRefresh }) {
  const navigate = useNavigate();
  
  if (documents.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg mb-2">No documents yet</p>
        <p className="text-gray-700 text-sm">Upload your first document above to get started</p>
      </div>
    );
  }
  
  /**
   * Map status to visual indicator
   */
  function statusBadge(status) {
    const styles = {
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      processing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      failed: 'bg-red-500/10 text-red-400 border-red-500/20',
      needs_review: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    };
    
    const labels = {
      completed: 'Completed',
      processing: 'Processing',
      failed: 'Failed',
      needs_review: 'Needs Review',
    };
    
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[status] || styles.processing}`}>
        {labels[status] || status}
      </span>
    );
  }
  
  /**
   * Format document type for display
   */
  function formatDocType(type) {
    if (!type) return 'Unknown';
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  
  /**
   * Format relative time
   */
  function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Documents</h2>
        <button
          onClick={onRefresh}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => doc.status === 'completed' && navigate(`/documents/${doc.id}`)}
            className={`
              flex items-center justify-between p-4 rounded-xl border border-white/5
              bg-[#111318] transition-all
              ${doc.status === 'completed' 
                ? 'hover:bg-[#161920] hover:border-white/10 cursor-pointer' 
                : 'opacity-70'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                {doc.doc_type === 'invoice' ? '🧾' :
                 doc.doc_type === 'customs_declaration' ? '🚢' :
                 doc.doc_type === 'contract' ? '📋' :
                 doc.doc_type === 'bank_statement' ? '🏦' : '📄'}
              </div>
              <div>
                <p className="font-medium text-sm">{doc.filename}</p>
                <p className="text-gray-600 text-xs mt-0.5">
                  {formatDocType(doc.doc_type)} · {timeAgo(doc.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {statusBadge(doc.status)}
              {doc.status === 'completed' && (
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================
// DASHBOARD PAGE
// ============================================

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  async function loadDocuments() {
    try {
      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  function handleUploadComplete(result) {
    // Reload the document list after upload
    loadDocuments();
  }
  
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-500">Upload documents and extract structured data instantly.</p>
      </div>
      
      {/* Upload Zone */}
      <FileUpload onUploadComplete={handleUploadComplete} />
      
      {/* Document List */}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Loading documents...</div>
      ) : (
        <DocumentList documents={documents} onRefresh={loadDocuments} />
      )}
    </div>
  );
}

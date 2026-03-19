/**
 * DocumentView.jsx — Document Detail & Extraction View
 * ======================================================
 * 
 * This page shows the results of document extraction.
 * Users see:
 * 1. Document metadata (name, type, when uploaded)
 * 2. All extracted fields with confidence scores
 * 3. Export buttons (JSON, CSV)
 * 4. Overall confidence indicator
 * 
 * THIS IS THE "WOW" PAGE — where clients see the value.
 * When you demo Klarifi, you show them uploading a document
 * and then landing here with all their data extracted.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument, exportDocument } from '../api';

// ============================================
// CONFIDENCE BAR — Visual confidence indicator
// ============================================

function ConfidenceBar({ value }) {
  const percentage = Math.round(value * 100);
  
  let color = 'bg-emerald-400';
  if (percentage < 70) color = 'bg-red-400';
  else if (percentage < 85) color = 'bg-yellow-400';
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${
        percentage >= 85 ? 'text-emerald-400' :
        percentage >= 70 ? 'text-yellow-400' : 'text-red-400'
      }`}>
        {percentage}%
      </span>
    </div>
  );
}


// ============================================
// EXTRACTION TABLE — Shows all extracted fields
// ============================================

function ExtractionTable({ fields }) {
  /**
   * Group fields by type for better organization
   */
  function fieldTypeIcon(type) {
    const icons = {
      currency: '💰',
      date: '📅',
      address: '📍',
      phone: '📞',
      email: '✉️',
      number: '#️⃣',
      reference_number: '🔗',
      percentage: '📊',
      text: '📝',
    };
    return icons[type] || '📝';
  }
  
  /**
   * Format field names for display:
   * "invoice_total" → "Invoice Total"
   */
  function formatFieldName(name) {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  
  return (
    <div className="space-y-1.5">
      {fields.map((field, index) => (
        <div
          key={index}
          className="flex items-center justify-between px-4 py-3 bg-[#111318] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-sm">{fieldTypeIcon(field.field_type)}</span>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {formatFieldName(field.field_name)}
              </p>
              <p className="text-sm font-semibold text-white mt-0.5 truncate">
                {field.field_value}
              </p>
            </div>
          </div>
          
          <div className="ml-4 shrink-0">
            <ConfidenceBar value={field.confidence} />
          </div>
        </div>
      ))}
    </div>
  );
}


// ============================================
// DOCUMENT VIEW PAGE
// ============================================

export default function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  
  useEffect(() => {
    async function load() {
      try {
        const data = await getDocument(id);
        setDoc(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setAnalyzing(false);
      }
    }
    load();
    
    // Simulate AI extraction time 
    const timer = setTimeout(() => {
      setAnalyzing(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  /**
   * Handle export — download extracted data as JSON or CSV
   */
  async function handleExport(format) {
    setExporting(true);
    try {
      const data = await exportDocument(id, format);
      
      if (format === 'csv') {
        // Download CSV file
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `klarifi_${id.slice(0, 8)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Download JSON file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `klarifi_${id.slice(0, 8)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }
  
  // Loading or Analyzing state
  if (loading || analyzing) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 flex flex-col items-center justify-center min-h-[60vh]">
        {/* Cheeky Scanning Animation */}
        <div className="relative w-24 h-32 bg-[#111318] border border-white/10 rounded-lg overflow-hidden mb-8 shadow-2xl">
          {/* Document lines */}
          <div className="absolute inset-x-4 top-6 h-1 rounded bg-white/10"></div>
          <div className="absolute inset-x-4 top-10 h-1 rounded bg-white/10"></div>
          <div className="absolute inset-x-4 top-14 h-1 rounded bg-white/10 w-3/4"></div>
          <div className="absolute inset-x-4 top-20 h-1 rounded bg-white/10"></div>
          <div className="absolute inset-x-4 top-24 h-1 rounded bg-white/10 w-5/6"></div>
          
          {/* Scanner beam */}
          <div className="absolute inset-x-0 h-1 bg-klarifi-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]" style={{
            animation: 'scan 1.5s ease-in-out infinite alternate'
          }}></div>
        </div>
        
        <h2 className="text-xl font-display font-medium text-white mb-3 flex items-center gap-2">
          <span>Clarifying Document</span>
          <span className="flex gap-1.5 items-center mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-klarifi-500 animate-[bounce_1s_infinite_0ms]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-klarifi-400 animate-[bounce_1s_infinite_150ms]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-[bounce_1s_infinite_300ms]"></span>
          </span>
        </h2>
        <p className="text-gray-500 text-sm">Our AI models are extracting structured data...</p>
        
        <style dangerouslySetInnerHTML={{__html:`
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}} />
      </div>
    );
  }
  
  // Error state
  if (error || !doc) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-red-400 mb-4">{error || 'Document not found'}</p>
        <button onClick={() => navigate('/dashboard')} className="text-klarifi-400 hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const extraction = doc.extraction;
  const fields = extraction?.fields || [];
  const confidence = extraction?.overall_confidence || 0;
  
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Dashboard
      </button>
      
      {/* Document Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl mb-1">{doc.filename}</h1>
            <p className="text-gray-500 text-sm">
              {doc.doc_type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} · 
              {extraction?.page_count || 1} page{(extraction?.page_count || 1) > 1 ? 's' : ''} · 
              Processed in {extraction?.processing_time_ms || 0}ms
            </p>
          </div>
        </div>
        
        {/* Stats bar */}
        <div className="flex gap-4">
          <div className="flex-1 px-4 py-3 bg-[#111318] border border-white/5 rounded-xl">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Fields Extracted</p>
            <p className="text-xl font-bold text-white mt-1">{fields.length}</p>
          </div>
          <div className="flex-1 px-4 py-3 bg-[#111318] border border-white/5 rounded-xl">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Confidence</p>
            <p className={`text-xl font-bold mt-1 ${
              confidence >= 0.85 ? 'text-emerald-400' :
              confidence >= 0.7 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {Math.round(confidence * 100)}%
            </p>
          </div>
          <div className="flex-1 px-4 py-3 bg-[#111318] border border-white/5 rounded-xl">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Speed</p>
            <p className="text-xl font-bold text-klarifi-400 mt-1">
              {((extraction?.processing_time_ms || 0) / 1000).toFixed(1)}s
            </p>
          </div>
        </div>
      </div>
      
      {/* Export Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleExport('json')}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 bg-klarifi-500 hover:bg-klarifi-400 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          <span>{ }{ }</span> Export JSON
        </button>
        <button
          onClick={() => handleExport('csv')}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
        >
          📊 Export CSV
        </button>
      </div>
      
      {/* Extracted Fields */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">Extracted Data</h2>
      </div>
      
      {fields.length > 0 ? (
        <ExtractionTable fields={fields} />
      ) : (
        <div className="text-center py-12 text-gray-600">
          No fields were extracted from this document.
        </div>
      )}
      
      {/* Confidence notice */}
      {confidence < 0.7 && fields.length > 0 && (
        <div className="mt-6 px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <p className="text-orange-400 text-sm font-medium">
            ⚠️ Low confidence extraction — please review the data carefully before exporting.
          </p>
        </div>
      )}
    </div>
  );
}

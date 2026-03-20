/**
 * api.js — API Helper for Klerifi Frontend
 * ==========================================
 * 
 * This file handles ALL communication with the backend.
 * Every time the frontend needs data or wants to send data,
 * it goes through these functions.
 * 
 * WHY A SEPARATE FILE?
 * Instead of writing fetch() calls everywhere, we centralize
 * them here. If the API URL changes, we change it in ONE place.
 * If we need to add auth headers, we add them in ONE place.
 */

// In development, Vite proxies /api to localhost:8000
// In production, set VITE_API_URL to your backend URL (e.g. https://klarifi-api.onrender.com/api)
const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Get the auth token from localStorage.
 * This token proves who the user is to the backend.
 */
function getToken() {
  return localStorage.getItem('klerifi_token');
}

/**
 * Make an authenticated API request.
 * Automatically adds the auth token to every request.
 */
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    ...options.headers,
  };
  
  // Add auth token if we have one
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add JSON content type for non-file requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  // Handle CSV downloads
  if (response.headers.get('content-type')?.includes('text/csv')) {
    return response.blob();
  }
  
  return response.json();
}


// ============================================
// AUTH
// ============================================

export async function signup(email, password) {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  // Store the token for future requests
  localStorage.setItem('klerifi_token', data.access_token);
  localStorage.setItem('klerifi_user', JSON.stringify({
    id: data.user_id,
    email: data.email,
  }));
  
  return data;
}

export async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  localStorage.setItem('klerifi_token', data.access_token);
  localStorage.setItem('klerifi_user', JSON.stringify({
    id: data.user_id,
    email: data.email,
  }));
  
  return data;
}

export function logout() {
  localStorage.removeItem('klerifi_token');
  localStorage.removeItem('klerifi_user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('klerifi_user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return !!getToken();
}


// ============================================
// DOCUMENTS
// ============================================

export async function uploadDocument(file) {
  /**
   * Upload a document for extraction.
   * 
   * We use FormData because we're sending a file (binary data),
   * not JSON. FormData is how browsers handle file uploads.
   */
  const formData = new FormData();
  formData.append('file', file);
  
  return apiRequest('/documents/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getDocuments() {
  return apiRequest('/documents');
}

export async function getDocument(id) {
  return apiRequest(`/documents/${id}`);
}

export async function exportDocument(id, format = 'json') {
  return apiRequest(`/documents/${id}/export`, {
    method: 'POST',
    body: JSON.stringify({ format }),
  });
}


// ============================================
// USAGE
// ============================================

export async function getUsage() {
  return apiRequest('/usage');
}

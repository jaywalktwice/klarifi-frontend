const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
    return localStorage.getItem('klarifi_token');
}

async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = { ...options.headers };
    if (token) { headers['Authorization'] = 'Bearer ' + token; }
    if (!(options.body instanceof FormData)) { headers['Content-Type'] = 'application/json'; }
    const response = await fetch(API_BASE + endpoint, { ...options, headers });
    if (!response.ok) {
          const error = await response.json().catch(() => ({ detail: 'Request failed' }));
          throw new Error(error.detail || 'HTTP ' + response.status);
    }
    if (response.headers.get('content-type')?.includes('text/csv')) { return response.blob(); }
    return response.json();
}

export async function signup(email, password) {
    const data = await apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('klarifi_token', data.access_token);
    localStorage.setItem('klarifi_user', JSON.stringify({ id: data.user_id, email: data.email }));
    return data;
}

export async function login(email, password) {
    const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('klarifi_token', data.access_token);
    localStorage.setItem('klarifi_user', JSON.stringify({ id: data.user_id, email: data.email }));
    return data;
}

export function logout() {
    localStorage.removeItem('klarifi_token');
    localStorage.removeItem('klarifi_user');
}

export function getCurrentUser() {
    const user = localStorage.getItem('klarifi_user');
    return user ? JSON.parse(user) : null;
}

export function isAuthenticated() { return !!getToken(); }

export async function uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/documents/upload', { method: 'POST', body: formData });
}

export async function getDocuments() { return apiRequest('/documents'); }
export async function getDocument(id) { return apiRequest('/documents/' + id); }

export async function exportDocument(id, format) {
    return apiRequest('/documents/' + id + '/export', { method: 'POST', body: JSON.stringify({ format: format || 'json' }) });
}

export async function getUsage() { return apiRequest('/usage'); }

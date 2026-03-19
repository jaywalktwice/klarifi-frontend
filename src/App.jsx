import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from './api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentView from './pages/DocumentView';

function Navbar() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    function handleLogout() {
          logout();
          navigate('/login');
    }
    return (
          <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-[#0A0C10]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-klarifi-500 to-cyan-300 flex items-center justify-center text-sm font-bold">K</div>div>
                                  <span className="font-semibold text-lg tracking-tight">Klari<span className="text-klarifi-400">fi</span>span></span>span>
                        </Link>Link>
                  {user && (
                      <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-500">{user.email}</span>span>
                                  <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition-colors">Log out</button>button>
                      </div>div>
                        )}
                </div>div>
          </nav>nav>
        );
}

function ProtectedRoute({ children }) {
    if (!isAuthenticated()) { return <Navigate to="/login" replace />; }
    return children;
}

export default function App() {
    return (
          <BrowserRouter>
                <div className="min-h-screen bg-[#0A0C10]">
                        <Navbar />
                        <main className="pt-20">
                                  <Routes>
                                              <Route path="/login" element={<Login />} />
                                              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>ProtectedRoute>} />
                                                          <Route path="/documents/:id" element={<ProtectedRoute><DocumentView /></ProtectedRoute>ProtectedRoute>} />
                                                                      <Route path="*" element={<Navigate to="/" replace />} />
                                                          </Route>Routes>
                                              </Route>main>
                                  </Routes>div>
                        </main>BrowserRouter>
                  );
                  }</nav>

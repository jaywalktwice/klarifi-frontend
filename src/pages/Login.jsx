/**
 * Login.jsx — Authentication Page
 * =================================
 * 
 * Handles both login and signup.
 * Toggles between the two modes with a tab.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-klarifi-500 to-cyan-300 flex items-center justify-center text-lg font-bold">
              K
            </div>
          </div>
          <h1 className="font-display text-3xl mb-2">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-gray-500">
            {isSignup 
              ? 'Start extracting data from your documents' 
              : 'Documents, clarified.'}
          </p>
        </div>
        
        {/* Form */}
        <div className="bg-[#111318] border border-white/5 rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-[#0A0C10] rounded-lg p-1">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !isSignup 
                  ? 'bg-[#1C1F28] text-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                isSignup 
                  ? 'bg-[#1C1F28] text-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 bg-[#0A0C10] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-klarifi-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-3 bg-[#0A0C10] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-klarifi-500 transition-colors"
              />
            </div>
            
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-klarifi-500 hover:bg-klarifi-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? 'Please wait...' 
                : isSignup ? 'Create Account' : 'Log In'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-gray-600 text-xs mt-6">
          Built in Windhoek, Namibia 🇳🇦
        </p>
      </div>
    </div>
  );
}

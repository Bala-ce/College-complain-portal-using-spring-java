// src/components/Auth.jsx
import React, { useState } from 'react';

export default function Auth() {
  // 'login' | 'register' | 'forgot' | 'otp' | 'reset'
  const [view, setView] = useState('login');

  const handleLogin = (e) => {
    e.preventDefault();
    alert('Mock Login Successful!');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setView('login');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setView('otp');
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setView('reset');
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setView('login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">College Portal</h1>
          <p className="text-sm text-slate-600 mt-1">
            {view === 'login' && 'Sign in to your account'}
            {view === 'register' && 'Create a new account'}
            {view === 'forgot' && 'Reset your password'}
            {view === 'otp' && 'Enter OTP from your email'}
            {view === 'reset' && 'Create a new password'}
          </p>
        </div>

        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="student@college.edu"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors mt-2"
            >
              Login
            </button>
            <div className="text-center mt-4">
              <span className="text-sm text-slate-600">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setView('register')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Create a new account
              </button>
            </div>
          </form>
        )}

        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">User Name</label>
              <input type="text" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">College Mail</label>
              <input type="email" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Create Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors mt-2">
              Create
            </button>
            <div className="text-center mt-4">
              <button type="button" onClick={() => setView('login')} className="text-sm text-slate-500 hover:text-slate-700 font-medium">Back to Login</button>
            </div>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors mt-2">
              Send OTP
            </button>
            <div className="text-center mt-4">
              <button type="button" onClick={() => setView('login')} className="text-sm text-slate-500 hover:text-slate-700 font-medium">Back to Login</button>
            </div>
          </form>
        )}

        {view === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Enter 4-Digit OTP</label>
              <input type="text" maxLength="4" required pattern="\d{4}" className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 text-center tracking-[1em] text-lg font-semibold" placeholder="••••" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors mt-2">
              Verify OTP
            </button>
            <div className="text-center mt-4">
              <button type="button" onClick={() => setView('login')} className="text-sm text-slate-500 hover:text-slate-700 font-medium">Back to Login</button>
            </div>
          </form>
        )}

        {view === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors mt-2">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

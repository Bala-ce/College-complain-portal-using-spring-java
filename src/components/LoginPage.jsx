// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { api } from '../services/api.js';

export default function LoginPage({ onLoginSuccess }) {
  // 'login' | 'register' | 'forgot'
  const [view, setView] = useState('login');

  // ── Login state ──────────────────────────────────────
  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError,    setLoginError]    = useState('');
  const [loginLoading,  setLoginLoading]  = useState(false);

  // ── Register state ───────────────────────────────────
  const [regName,            setRegName]            = useState('');
  const [regNo,              setRegNo]              = useState('');
  const [regEmail,           setRegEmail]           = useState('');
  const [regPassword,        setRegPassword]        = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError,           setRegError]           = useState('');
  const [regLoading,         setRegLoading]         = useState(false);

  // ── Forgot Password state ────────────────────────────
  const [fpEmail,       setFpEmail]       = useState('');
  const [fpNew,         setFpNew]         = useState('');
  const [fpConfirm,     setFpConfirm]     = useState('');
  const [fpMsg,         setFpMsg]         = useState('');
  const [fpLoading,     setFpLoading]     = useState(false);
  const [fpStep,        setFpStep]        = useState(1); // 1=enter email, 2=enter new password

  // ── Handlers ─────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const user = await api.login({ email: loginEmail, password: loginPassword });
      onLoginSuccess(user);
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    setRegLoading(true);
    try {
      const user = await api.register({
        fullName:       regName,
        email:          regEmail,
        password:       regPassword,
        registerNumber: regNo,
      });
      onLoginSuccess(user);
    } catch (err) {
      setRegError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleFpCheckEmail = async (e) => {
    e.preventDefault();
    setFpMsg('');
    // We don't reveal if email exists; just move to step 2
    setFpStep(2);
  };

  const handleFpReset = async (e) => {
    e.preventDefault();
    setFpMsg('');
    if (fpNew !== fpConfirm) {
      setFpMsg('Passwords do not match.');
      return;
    }
    if (fpNew.length < 6) {
      setFpMsg('Password must be at least 6 characters.');
      return;
    }
    setFpLoading(true);
    try {
      await api.forgotPassword(fpEmail, fpNew);
      setFpMsg('✓ Password reset successfully! You can now login.');
      setFpStep(1);
      setFpEmail(''); setFpNew(''); setFpConfirm('');
      setTimeout(() => { setView('login'); setFpMsg(''); }, 2000);
    } catch (err) {
      setFpMsg(err.message || 'Password reset failed. Please check your email.');
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-xl">

        {/* ─── Header ─── */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">College Complaint Portal</h1>
          <p className="text-sm text-slate-500 mt-1">
            {view === 'login'    && 'Sign in to your account'}
            {view === 'register' && 'Create a student account'}
            {view === 'forgot'   && 'Reset your password'}
          </p>
        </div>

        {/* ─── Login / Register Tabs (only when not in forgot flow) ─── */}
        {view !== 'forgot' && (
          <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
            <button
              onClick={() => { setView('login'); setLoginError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'login' ? 'bg-white shadow text-emerald-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setView('register'); setRegError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'register' ? 'bg-white shadow text-emerald-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* ─────────── LOGIN FORM ─────────── */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email" required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="student@college.edu"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => { setView('forgot'); setFpMsg(''); setFpStep(1); }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password" required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors mt-2 disabled:opacity-60"
            >
              {loginLoading ? 'Signing in…' : 'Login'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
              Staff accounts are pre-configured. Students must register first.
            </p>
          </form>
        )}

        {/* ─────────── REGISTER FORM ─────────── */}
        {view === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {regError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {regError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text" required
                value={regName}
                onChange={e => setRegName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Register Number</label>
              <input
                type="text" required
                value={regNo}
                onChange={e => setRegNo(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 724621104001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">College Email</label>
              <input
                type="email" required
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="student@college.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password" required
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input
                type="password" required
                value={regConfirmPassword}
                onChange={e => setRegConfirmPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={regLoading}
              className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors mt-2 disabled:opacity-60"
            >
              {regLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}

        {/* ─────────── FORGOT PASSWORD FLOW ─────────── */}
        {view === 'forgot' && (
          <div>
            {fpMsg && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm border ${
                fpMsg.startsWith('✓')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {fpMsg}
              </div>
            )}

            {/* Step 1: Enter email */}
            {fpStep === 1 && (
              <form onSubmit={handleFpCheckEmail} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your registered email</label>
                  <input
                    type="email" required
                    value={fpEmail}
                    onChange={e => setFpEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="student@college.edu"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full text-sm text-slate-500 hover:text-slate-700 font-medium mt-1"
                >
                  ← Back to Login
                </button>
              </form>
            )}

            {/* Step 2: Enter new password */}
            {fpStep === 2 && (
              <form onSubmit={handleFpReset} className="space-y-4">
                <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  Resetting password for <strong>{fpEmail}</strong>
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                  <input
                    type="password" required
                    value={fpNew}
                    onChange={e => setFpNew(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password" required
                    value={fpConfirm}
                    onChange={e => setFpConfirm(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={fpLoading}
                  className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-60"
                >
                  {fpLoading ? 'Resetting…' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setFpStep(1)}
                  className="w-full text-sm text-slate-500 hover:text-slate-700 font-medium"
                >
                  ← Back
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

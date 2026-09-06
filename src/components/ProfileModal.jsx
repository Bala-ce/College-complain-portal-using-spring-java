import React, { useState } from 'react';
import { X, User, Lock, Save, Phone } from 'lucide-react';
import { api } from '../services/api.js';

const departments = [
  'Information Technology (IT)',
  'Electronics & Communication (ECE)',
  'Computer Science (CSE)',
  'Bio-Medical (BME)',
  'Artificial Intelligence & Data Science(AIDS)',
  'Artificial Intelligence & Machine Learning(AIML)',
  'Computer Science & Cyber Security(CSCS)',
  'Computer Science & Business Systems(CSBS)',
  'Very Large Scale Integration(VLSI)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics (EEE)',
];

const batches = ['2021-2025', '2022-2026', '2023-2027', '2024-2028', '2025-2029'];

export default function ProfileModal({ studentUser, onClose, onProfileUpdated }) {
  const [view, setView] = useState('profile'); // 'profile' | 'changePassword'

  // Profile fields
  const [fullName,       setFullName]       = useState(studentUser.fullName || '');
  const [mobileNumber,   setMobileNumber]   = useState(studentUser.mobileNumber || '');
  const [registerNumber, setRegisterNumber] = useState(studentUser.registerNumber || '');
  const [department,     setDepartment]     = useState(studentUser.department || '');
  const [batch,          setBatch]          = useState(studentUser.batch || '');
  const [profileMsg,     setProfileMsg]     = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Change password fields
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg,           setPwMsg]           = useState('');
  const [pwLoading,       setPwLoading]       = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileLoading(true);
    try {
      const updated = await api.updateProfile({
        email:        studentUser.email,
        fullName,
        mobileNumber,
        department,
        batch,
      });
      setProfileMsg('✓ Profile saved successfully!');
      if (onProfileUpdated) onProfileUpdated(updated);
    } catch (err) {
      setProfileMsg('Error: ' + (err.message || 'Failed to save profile.'));
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg('');
    if (newPassword !== confirmPassword) {
      setPwMsg('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg('Password must be at least 6 characters.');
      return;
    }
    setPwLoading(true);
    try {
      await api.changePassword(studentUser.email, newPassword);
      setPwMsg('✓ Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwMsg('Error: ' + (err.message || 'Failed to change password.'));
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-emerald-600 px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{studentUser.fullName}</h2>
              <p className="text-emerald-100 text-sm">{studentUser.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Tab Nav */}
        <div className="flex border-b border-slate-200 flex-shrink-0">
          <button
            onClick={() => { setView('profile'); setProfileMsg(''); }}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              view === 'profile'
                ? 'border-b-2 border-emerald-600 text-emerald-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User size={16} /> My Profile
          </button>
          <button
            onClick={() => { setView('changePassword'); setPwMsg(''); }}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              view === 'changePassword'
                ? 'border-b-2 border-emerald-600 text-emerald-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Lock size={16} /> Change Password
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">

          {/* ─── Profile Tab ─── */}
          {view === 'profile' && (
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Register Number</label>
                <input
                  type="text"
                  value={registerNumber}
                  readOnly
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Register number cannot be changed after registration.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</label>
                <input
                  type="email"
                  value={studentUser.email}
                  readOnly
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Batch</label>
                <select
                  value={batch}
                  onChange={e => setBatch(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="">-- Select Batch --</option>
                  {batches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {profileMsg && (
                <p className={`text-sm font-medium ${profileMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {profileMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save size={16} />
                {profileLoading ? 'Saving…' : 'Save Profile'}
              </button>
            </form>
          )}

          {/* ─── Change Password Tab ─── */}
          {view === 'changePassword' && (
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                You are changing the password for <strong>{studentUser.email}</strong>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {pwMsg && (
                <p className={`text-sm font-medium ${pwMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {pwMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={pwLoading}
                className="w-full bg-emerald-600 text-white font-medium rounded-lg py-2.5 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Lock size={16} />
                {pwLoading ? 'Updating…' : 'Change Password'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

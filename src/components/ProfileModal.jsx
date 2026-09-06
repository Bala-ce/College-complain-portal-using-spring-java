import React, { useState } from 'react';
import { X, User, Lock, Save, Phone, Shield, Hash, Pencil, XCircle } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false); // view mode by default

  // Profile fields
  const [fullName, setFullName] = useState(studentUser.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(studentUser.mobileNumber || '');
  const [registerNumber, setRegisterNumber] = useState(studentUser.registerNumber || '');
  const [department, setDepartment] = useState(studentUser.department || '');
  const [batch, setBatch] = useState(studentUser.batch || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Cancel editing — revert to original values
  const handleCancelEdit = () => {
    setFullName(studentUser.fullName || '');
    setMobileNumber(studentUser.mobileNumber || '');
    setDepartment(studentUser.department || '');
    setBatch(studentUser.batch || '');
    setProfileMsg('');
    setIsEditing(false);
  };

  // Change password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileLoading(true);
    try {
      const updated = await api.updateProfile({
        email: studentUser.email,
        fullName,
        mobileNumber,
        department,
        batch,
      });
      setProfileMsg('✓ Profile saved successfully!');
      setIsEditing(false);
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
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${view === 'profile'
              ? 'border-b-2 border-emerald-600 text-emerald-700'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <User size={16} /> My Profile
          </button>
          <button
            onClick={() => { setView('changePassword'); setPwMsg(''); }}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${view === 'changePassword'
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

              {/* View / Edit mode banner */}
              {!isEditing && (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Lock size={14} />
                    <span className="text-xs font-medium">Profile is in view-only mode</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setProfileMsg(''); setIsEditing(true); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Pencil size={13} /> Edit Profile
                  </button>
                </div>
              )}

              {isEditing && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <Pencil size={14} className="text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">You are now editing your profile</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full border rounded-lg p-2.5 text-sm outline-none transition-colors ${isEditing
                    ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600 cursor-default'
                    }`}
                  placeholder="Your full name"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none transition-colors ${isEditing
                      ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-600 cursor-default'
                      }`}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Register Number — always locked */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Register Number</label>
                <div className="relative">
                  <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Lock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    value={registerNumber}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg pl-9 pr-8 py-2.5 text-sm bg-slate-50 text-slate-700 font-mono cursor-not-allowed select-none tracking-wider"
                    placeholder="Not set"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Lock size={11} /> Register number is permanent and cannot be changed.
                </p>
              </div>

              {/* Email — always locked */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</label>
                <div className="relative">
                  <Lock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="email"
                    value={studentUser.email}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg p-2.5 pr-8 text-sm bg-slate-50 text-slate-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Lock size={11} /> Email address cannot be changed.
                </p>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Department</label>
                {isEditing ? (
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full border border-emerald-400 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={department || 'Not set'}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 text-slate-600 cursor-default"
                  />
                )}
              </div>

              {/* Batch */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Batch</label>
                {isEditing ? (
                  <select
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                    className="w-full border border-emerald-400 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
                  >
                    <option value="">-- Select Batch --</option>
                    {batches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={batch || 'Not set'}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 text-slate-600 cursor-default"
                  />
                )}
              </div>

              {/* Privacy Notice */}
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <Shield size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-0.5">Your Privacy is Protected</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    The information provided in your profile is used solely for identification and communication purposes within the College Complaint Portal. Your personal details will never be shared with the Faculty members while Raising a Complaint.
                  </p>
                </div>
              </div>

              {profileMsg && (
                <p className={`text-sm font-medium ${profileMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {profileMsg}
                </p>
              )}

              {/* Action buttons */}
              {isEditing && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <XCircle size={16} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
                  >
                    <Save size={16} />
                    {profileLoading ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              )}
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

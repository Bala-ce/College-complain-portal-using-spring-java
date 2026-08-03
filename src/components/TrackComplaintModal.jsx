// src/components/TrackComplaintModal.jsx
import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

export default function TrackComplaintModal({ onClose }) {
  const [trackingId, setTrackingId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    // The user requested it should only ask for the complaint ID and not do anything.
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up sm:animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Track Complaint</h2>

        <form onSubmit={handleSearch}>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Enter Tracking ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. #CMP-123456"
              className="flex-1 border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

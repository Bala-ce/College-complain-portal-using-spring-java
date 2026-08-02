// src/components/TrackComplaintModal.jsx
import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle } from 'lucide-react';

export default function TrackComplaintModal({ onClose, complaints }) {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    const found = complaints.find(
      (c) => c.id.toLowerCase() === trackingId.trim().toLowerCase()
    );

    if (found) {
      setResult(found);
      setError('');
    } else {
      setResult(null);
      setError('Complaint not found. Please check your Tracking ID.');
    }
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

        <form onSubmit={handleSearch} className="mb-6">
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        {result && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
                <CheckCircle size={14} /> Registered
              </span>
              <span className="text-xs text-slate-500">{new Date(result.date).toLocaleDateString()}</span>
            </div>
            
            <h3 className="font-semibold text-slate-900 mb-1">{result.subject}</h3>
            <p className="text-xs text-slate-500 font-medium mb-3">{result.dept}</p>
            
            <div className="bg-white border border-slate-200 rounded p-3 text-sm text-slate-700 mb-3 whitespace-pre-wrap">
              {result.description}
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-600 font-medium bg-amber-50 p-2 rounded border border-amber-200">
              <Clock size={16} />
              Status: Action Pending
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

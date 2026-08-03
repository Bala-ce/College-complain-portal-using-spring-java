// src/components/HistoryModal.jsx
import React from 'react';
import { X, History } from 'lucide-react';

export default function HistoryModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up sm:animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
            <History size={24} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Complaint History</h2>
        </div>

        <div className="text-center py-8">
          <p className="text-slate-500 font-medium">There is no previous complaints.</p>
        </div>
      </div>
    </div>
  );
}

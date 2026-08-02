// src/components/SuccessModal.jsx
import React from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function SuccessModal({ complaintId, department, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl text-center relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
        
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Complaint Registered!
        </h2>
        
        <p className="text-sm text-slate-600 mb-4">
          Your complaint for <span className="font-medium">{department}</span> has been successfully logged.
        </p>
        
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Tracking ID</span>
          <p className="text-lg font-bold text-slate-800">{complaintId}</p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-slate-900 text-white font-medium rounded-lg py-2.5 hover:bg-slate-800 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}

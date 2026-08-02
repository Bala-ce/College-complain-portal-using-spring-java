// src/components/PrivacyConsentModal.jsx
import React from 'react';
import { Shield, Check } from 'lucide-react';

export default function PrivacyConsentModal({ onAccept, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-fade-in relative text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
          <Shield size={32} className="text-emerald-600" />
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Strictly Confidential
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Please be assured that your identity, name or profile details and personal details will remain strictly confidential. They will not be shared with the personnel assisting in the resolution or the department receiving this complaint. and you will be given a complaint ID to tack your complaint.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={18} />
            I Understand & Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

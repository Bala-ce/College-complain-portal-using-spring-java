// src/components/DashboardMenu.jsx
import React from 'react';
import { PlusCircle, Search, History } from 'lucide-react';

export default function DashboardMenu({ onRaiseComplaint, onTrackComplaint, onHistory }) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 mt-6">
      <button
        onClick={onRaiseComplaint}
        className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all active:scale-95 group"
      >
        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <PlusCircle size={28} />
        </div>
        <div className="text-left flex-1">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Raise a Complaint</h2>
          <p className="text-sm text-slate-500">Submit a new grievance anonymously</p>
        </div>
      </button>

      <button
        onClick={onTrackComplaint}
        className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all active:scale-95 group"
      >
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <Search size={28} />
        </div>
        <div className="text-left flex-1">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Track the Complaints</h2>
          <p className="text-sm text-slate-500">Check the status of an existing complaint</p>
        </div>
      </button>

      <button
        onClick={onHistory}
        className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all active:scale-95 group"
      >
        <div className="bg-slate-100 text-slate-600 p-3 rounded-xl group-hover:bg-slate-600 group-hover:text-white transition-colors">
          <History size={28} />
        </div>
        <div className="text-left flex-1">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Your Complaint History</h2>
          <p className="text-sm text-slate-500">View your previously submitted complaints</p>
        </div>
      </button>
    </div>
  );
}

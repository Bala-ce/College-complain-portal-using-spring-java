// src/components/Header.jsx
import React from 'react';
import { Search } from 'lucide-react';

export default function Header({ onTrackClick }) {
  return (
    <header className="w-full max-w-lg mx-auto py-6 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          College Complaints
        </h1>
        <button
          onClick={onTrackClick}
          className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-full transition-colors active:scale-95"
        >
          <Search size={16} />
          Track
        </button>
      </div>
      <p className="text-sm text-slate-600">
        Fast, Anonymous & Transparent Student Grievance System
      </p>
    </header>
  );
}

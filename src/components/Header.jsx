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
      </div>
      <p className="text-sm text-slate-600">
        Fast, Anonymous & Transparent Student Grievance System
      </p>
    </header>
  );
}

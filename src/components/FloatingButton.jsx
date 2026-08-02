// src/components/FloatingButton.jsx
import React from 'react';
import { Plus } from 'lucide-react';

export default function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 active:scale-95 transition-transform flex items-center justify-center z-10"
      aria-label="Raise Complaint"
    >
      <Plus size={28} />
    </button>
  );
}

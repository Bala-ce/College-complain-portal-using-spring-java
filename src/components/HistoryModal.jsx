// src/components/HistoryModal.jsx
import React, { useEffect, useState } from 'react';
import { X, History, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api.js';

export default function HistoryModal({ onClose, studentEmail }) {
  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!studentEmail) return;
      try {
        const data = await api.getComplaintsByStudent(studentEmail);
        setComplaints(data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [studentEmail]);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-slide-up sm:animate-fade-in relative max-h-[85vh] overflow-y-auto">
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

        {loading ? (
          <div className="text-center py-8">
            <p className="text-slate-400">Loading your complaints…</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 font-medium">There are no previous complaints.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div 
                  className="p-4 bg-slate-50 cursor-pointer flex justify-between items-center hover:bg-slate-100 transition-colors"
                  onClick={() => toggleExpand(c.id)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{c.complaintCode}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                        c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800">{c.subject}</p>
                    <p className="text-xs text-slate-500">{c.department} • {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-slate-400">
                    {expandedId === c.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                
                {expandedId === c.id && (
                  <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</h4>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.description}</p>
                    </div>
                    
                    {c.officialReply && (
                      <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                        <h4 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">Official Response</h4>
                        <p className="text-sm text-emerald-900">{c.officialReply}</p>
                      </div>
                    )}

                    {c.imageData && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Attachment</h4>
                        <img 
                          src={c.imageData} 
                          alt="Attachment" 
                          className="mt-2 max-w-full h-auto max-h-48 object-contain rounded border border-slate-200" 
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

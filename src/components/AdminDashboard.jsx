import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, CheckCircle, Clock, AlertCircle,
  X, LogOut, Eye, Filter, ListCollapse, MessageSquare, Save, Tag
} from 'lucide-react';
import { api } from '../services/api.js';

export default function AdminDashboard({
  adminUser = { fullName: 'Admin', role: 'DEPT_ADMIN', department: 'All Departments' },
  onLogout
}) {
  const [complaints,        setComplaints]        = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [searchQuery,       setSearchQuery]       = useState('');
  const [activeFilter,      setActiveFilter]      = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusUpdate,      setStatusUpdate]      = useState('');
  const [responseUpdate,    setResponseUpdate]    = useState('');
  const [imagePreview,      setImagePreview]      = useState(false);
  const [saveLoading,       setSaveLoading]       = useState(false);

  // ── Fetch real complaints from DB on mount ──
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getAllComplaints();
        setComplaints(data || []);
      } catch (err) {
        console.error('Failed to load complaints:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Stats (computed from real data) ──
  const stats = useMemo(() => {
    const total      = complaints.length;
    const pending    = complaints.filter(c => c.status === 'PENDING').length;
    const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS').length;
    const delayed    = complaints.filter(c => {
      if (c.status === 'RESOLVED') return false;
      const days = Math.floor((Date.now() - new Date(c.createdAt)) / 86400000);
      return days > 3;
    }).length;
    return { total, pending, inProgress, delayed };
  }, [complaints]);

  // ── Filter & Search ──
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const id      = (c.complaintCode || '').toLowerCase();
      const subject = (c.subject       || '').toLowerCase();
      const q       = searchQuery.toLowerCase();
      const matchesSearch = id.includes(q) || subject.includes(q);
      if (!matchesSearch) return false;
      if (activeFilter === 'All')            return true;
      if (activeFilter === 'Pending')        return c.status === 'PENDING';
      if (activeFilter === 'In Progress')    return c.status === 'IN_PROGRESS';
      if (activeFilter === 'Resolved')       return c.status === 'RESOLVED';
      if (activeFilter === 'Delayed (>3 Days)') {
        if (c.status === 'RESOLVED') return false;
        const days = Math.floor((Date.now() - new Date(c.createdAt)) / 86400000);
        return days > 3;
      }
      return true;
    });
  }, [complaints, searchQuery, activeFilter]);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusUpdate(complaint.status || 'PENDING');
    setResponseUpdate(complaint.officialReply || '');
    setImagePreview(false);
  };

  // ── Save: call real PATCH API ──
  const handleSaveUpdate = async () => {
    setSaveLoading(true);
    try {
      const updated = await api.updateComplaintStatus(
        selectedComplaint.id,
        statusUpdate,
        responseUpdate
      );
      setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelectedComplaint(null);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // ── Helpers ──
  const getPriorityClasses = (priority = '') => {
    switch (priority.toUpperCase()) {
      case 'URGENT': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH':   return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700 border-blue-200';
      default:       return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const daysSince = (dateStr) =>
    Math.floor((Date.now() - new Date(dateStr)) / 86400000);

  const renderStatusBadge = (status, createdAt) => {
    const days = daysSince(createdAt);
    if (status !== 'RESOLVED' && days > 3) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5 w-fit">
          <AlertCircle size={14} /> Delayed
        </span>
      );
    }
    switch (status) {
      case 'RESOLVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 w-fit"><CheckCircle size={14} /> Resolved</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 w-fit"><Clock size={14} /> In Progress</span>;
      case 'PENDING':
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 w-fit"><AlertCircle size={14} /> Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <ListCollapse className="text-emerald-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">College Complaint Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{adminUser.fullName || adminUser.name}</p>
            <p className="text-xs text-slate-500">{adminUser.role} • {adminUser.department}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Complaints</p>
            <p className="text-3xl font-bold text-slate-900">{loading ? '–' : stats.total}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-slate-900">{loading ? '–' : stats.pending}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-slate-900">{loading ? '–' : stats.inProgress}</p>
          </div>
          <div className="bg-red-50 p-5 rounded-xl border border-red-300 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={16} className="text-red-600" />
              <p className="text-sm font-medium text-red-700">SLA Alert (&gt;3 Days)</p>
            </div>
            <p className="text-3xl font-bold text-red-700">{loading ? '–' : stats.delayed}</p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={18} className="text-slate-400 mr-1" />
            {['All', 'Pending', 'In Progress', 'Delayed (>3 Days)', 'Resolved'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or Subject..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Clock size={32} className="animate-spin mr-3" />
              <span className="text-base font-medium">Loading complaints from database…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Complaint ID</th>
                    <th className="px-6 py-4 font-semibold">Category / Subject</th>
                    <th className="px-6 py-4 font-semibold">Date Raised</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map(complaint => (
                      <tr
                        key={complaint.id}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => openModal(complaint)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            {complaint.complaintCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900 mb-0.5 line-clamp-1">{complaint.subject}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Tag size={12} /> {complaint.category} • {complaint.department}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityClasses(complaint.priority)}`}>
                            {complaint.priority || 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(complaint.status, complaint.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={e => { e.stopPropagation(); openModal(complaint); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                          >
                            <Eye size={16} /> Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search size={40} className="text-slate-300 mb-3" />
                          <p className="text-base font-medium text-slate-700">No complaints found</p>
                          <p className="text-sm">
                            {complaints.length === 0
                              ? 'No complaints have been submitted yet.'
                              : 'Try adjusting your filters or search query.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MANAGE MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">

            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-start sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedComplaint.complaintCode}
                  </span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {selectedComplaint.department}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedComplaint.subject}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><Tag size={14} /> {selectedComplaint.category}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Problem Description</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed">
                  {selectedComplaint.description}
                </div>
              </div>

              {selectedComplaint.imageData && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Attachment</h3>
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex justify-center items-center h-64">
                      <img src={selectedComplaint.imageData} alt="Attachment" className="max-h-full max-w-full object-contain" />
                      <button
                        onClick={() => setImagePreview(false)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => setImagePreview(true)}
                      className="w-32 h-24 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group relative"
                    >
                      <img src={selectedComplaint.imageData} alt="Thumbnail" className="w-full h-full object-cover group-hover:opacity-75" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="text-white drop-shadow-md" size={24} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Update Status</h3>
                <select
                  value={statusUpdate}
                  onChange={e => setStatusUpdate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
                >
                  <option value="PENDING">Pending (Under Review)</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <MessageSquare size={16} className="text-slate-500" /> Official Department Response
                </h3>
                <textarea
                  value={responseUpdate}
                  onChange={e => setResponseUpdate(e.target.value)}
                  placeholder="Enter resolution steps or update visible to the student..."
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-y"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl sticky bottom-0 z-10">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUpdate}
                disabled={saveLoading}
                className="px-4 py-2 flex items-center gap-2 text-sm font-medium text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm disabled:opacity-60"
              >
                <Save size={16} /> {saveLoading ? 'Saving…' : 'Save & Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  Search, CheckCircle, Clock, AlertCircle, 
  X, LogOut, Eye, Filter, ListCollapse, MessageSquare, Save, Tag
} from 'lucide-react';

const INITIAL_MOCK_COMPLAINTS = [
  {
    id: "CMP-1042",
    subject: "WiFi completely dead in Block A",
    category: "Internet & Network",
    department: "Information Technology",
    raisedDate: "Aug 24, 2026",
    priority: "High",
    status: "Pending",
    description: "The WiFi has been down for 2 days now in Block A. We are unable to complete our assignments. Please fix it ASAP.",
    daysPending: 4,
    imageUrl: "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?q=80&w=400&auto=format&fit=crop",
    officialResponse: "",
  },
  {
    id: "CMP-1045",
    subject: "Bus no. 14 didn't arrive on time",
    category: "Transport Schedule",
    department: "Transport & Bus Fleet",
    raisedDate: "Aug 22, 2026",
    priority: "Medium",
    status: "Pending",
    description: "Waited for 45 minutes, bus never showed up at the main gate stop.",
    daysPending: 6,
    imageUrl: null,
    officialResponse: "",
  },
  {
    id: "CMP-1046",
    subject: "Air Conditioner making loud noise",
    category: "Electrical",
    department: "Maintenance",
    raisedDate: "Aug 27, 2026",
    priority: "Low",
    status: "In Progress",
    description: "The AC in the library is making a rattling noise and cooling is very poor. Need someone to check the filter.",
    daysPending: 1,
    imageUrl: null,
    officialResponse: "Technician dispatched to check the AC unit.",
  },
  {
    id: "CMP-1047",
    subject: "Student ID card not issued",
    category: "Administration",
    department: "Admin",
    raisedDate: "Aug 25, 2026",
    priority: "Medium",
    status: "Pending",
    description: "I submitted my documents 3 days ago but haven't received my ID card yet.",
    daysPending: 3,
    imageUrl: null,
    officialResponse: "",
  },
  {
    id: "CMP-1048",
    subject: "Water cooler broken in CS Block",
    category: "Plumbing",
    department: "Maintenance",
    raisedDate: "Aug 20, 2026",
    priority: "Urgent",
    status: "Resolved",
    description: "No drinking water available on the 2nd floor of the Computer Science block.",
    daysPending: 8,
    imageUrl: null,
    officialResponse: "Plumber has fixed the pipe leak and the cooler is now functional.",
  }
];

export default function AdminDashboard({ 
  adminUser = { name: "Dr. Sharma", role: "ADMIN", department: "All Departments" }, 
  onLogout 
}) {
  const [complaints, setComplaints] = useState(INITIAL_MOCK_COMPLAINTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Modal State
  const [statusUpdate, setStatusUpdate] = useState('');
  const [responseUpdate, setResponseUpdate] = useState('');
  const [imagePreview, setImagePreview] = useState(false);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const delayed = complaints.filter(c => c.status !== 'Resolved' && c.daysPending > 3).length;
    return { total, pending, inProgress, delayed };
  }, [complaints]);

  // Filtered Data
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.subject.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Delayed (>3 Days)') return c.status !== 'Resolved' && c.daysPending > 3;
      return c.status === activeFilter;
    });
  }, [complaints, searchQuery, activeFilter]);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusUpdate(complaint.status);
    setResponseUpdate(complaint.officialResponse || '');
    setImagePreview(false);
  };

  const handleSaveUpdate = () => {
    setComplaints(prev => prev.map(c => 
      c.id === selectedComplaint.id 
        ? { ...c, status: statusUpdate, officialResponse: responseUpdate } 
        : c
    ));
    setSelectedComplaint(null);
  };

  // Helper for Priority Pills
  const getPriorityClasses = (priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Low': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Helper for Status Badges
  const renderStatusBadge = (status, daysPending) => {
    if (status !== 'Resolved' && daysPending > 3) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5 w-fit">
          <AlertCircle size={14}/> Delayed
        </span>
      );
    }
    switch(status) {
      case 'Resolved': 
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 w-fit">
            <CheckCircle size={14}/> Resolved
          </span>
        );
      case 'In Progress': 
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 w-fit">
            <Clock size={14}/> In Progress
          </span>
        );
      case 'Pending': 
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 w-fit">
            <AlertCircle size={14}/> Pending
          </span>
        );
      case 'Rejected': 
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5 w-fit">
            <X size={14}/> Rejected
          </span>
        );
      default: return null;
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
            <p className="text-sm font-semibold text-slate-900">{adminUser.name}</p>
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
        {/* 1. TOP SUMMARY STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Complaints</p>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-medium text-slate-500 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-slate-900">{stats.inProgress}</p>
          </div>
          <div className="bg-red-50 p-5 rounded-xl border border-red-300 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={16} className="text-red-600" />
              <p className="text-sm font-medium text-red-700">SLA Alert (&gt;3 Days)</p>
            </div>
            <p className="text-3xl font-bold text-red-700">{stats.delayed}</p>
          </div>
        </div>

        {/* 2. FILTER BAR & CONTROLS */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* 3. DEPARTMENT COMPLAINTS TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                  filteredComplaints.map((complaint) => (
                    <tr 
                      key={complaint.id} 
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => openModal(complaint)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {complaint.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 mb-0.5 line-clamp-1">{complaint.subject}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Tag size={12} /> {complaint.category}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {complaint.raisedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityClasses(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(complaint.status, complaint.daysPending)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(complaint);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        >
                          <Eye size={16} /> Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={40} className="text-slate-300 mb-3" />
                        <p className="text-base font-medium text-slate-700">No complaints found</p>
                        <p className="text-sm">Try adjusting your filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 4. STATUS UPDATE ACTION MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-start sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedComplaint.id}
                  </span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {selectedComplaint.department}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedComplaint.subject}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><Tag size={14}/> {selectedComplaint.category}</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {selectedComplaint.raisedDate}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 space-y-6">
              
              {/* Problem Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Problem Description</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed">
                  {selectedComplaint.description}
                </div>
              </div>

              {/* Attachment Section */}
              {selectedComplaint.imageUrl && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Attachment</h3>
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex justify-center items-center h-64">
                      <img src={selectedComplaint.imageUrl} alt="Issue Attachment" className="max-h-full max-w-full object-contain" />
                      <button 
                        onClick={() => setImagePreview(false)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setImagePreview(true)}
                      className="w-32 h-24 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group relative"
                    >
                      <img src={selectedComplaint.imageUrl} alt="Thumbnail" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="text-white drop-shadow-md" size={24} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status Updater */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Update Status</h3>
                  <select 
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-700"
                  >
                    <option value="Pending">Pending (Under Review)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Official Resolution Reply */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                  <MessageSquare size={16} className="text-slate-500"/> Official Department Response
                </h3>
                <textarea
                  value={responseUpdate}
                  onChange={(e) => setResponseUpdate(e.target.value)}
                  placeholder="Enter resolution steps or technician update visible to student..."
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[100px] resize-y"
                ></textarea>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-2xl sticky bottom-0 z-10">
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel / Close
              </button>
              <button 
                onClick={handleSaveUpdate}
                className="px-4 py-2 flex items-center gap-2 text-sm font-medium text-white bg-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Save size={16} /> Save & Update Status
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

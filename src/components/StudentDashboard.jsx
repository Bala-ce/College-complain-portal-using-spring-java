import React, { useState } from 'react';
import { api } from '../services/api.js';
import Header from './Header.jsx';
import ComplaintModal from './ComplaintModal.jsx';
import SuccessModal from './SuccessModal.jsx';
import TrackComplaintModal from './TrackComplaintModal.jsx';
import PrivacyConsentModal from './PrivacyConsentModal.jsx';
import DashboardMenu from './DashboardMenu.jsx';
import HistoryModal from './HistoryModal.jsx';
import ProfileModal from './ProfileModal.jsx';
import { User, LogOut } from 'lucide-react';

// Departments list
const departments = [
  'Information Technology (IT)',
  'Electronics & Communication (ECE)',
  'Computer Science (CSE)',
  'Bio-Medical (BME)',
  'Artificial Intelligence & Data Science(AIDS)',
  'Artificial Intelligence & Machine Learning(AIML)',
  'Computer Science & Cyber Security(CSCS)',
  'Computer Science & Business Systems(CSBS)',
  'Very Large Scale Integration(VLSI)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics (EEE)',
  'Transport & Bus Fleet',
  'Hostel & Dining Services',
  'Library',
  'Placement Cell',
  'Campus Maintenance & Facilities',
  'Student Misbehavior'
];

export default function StudentDashboard({ studentUser, onLogout }) {
  const [currentUser, setCurrentUser] = useState(studentUser);

  const [isModalOpen,       setIsModalOpen]       = useState(false);
  const [isSuccessOpen,     setIsSuccessOpen]     = useState(false);
  const [isTrackModalOpen,  setIsTrackModalOpen]  = useState(false);
  const [isPrivacyModalOpen,setIsPrivacyModalOpen]= useState(false);
  const [isHistoryModalOpen,setIsHistoryModalOpen]= useState(false);
  const [isProfileOpen,     setIsProfileOpen]     = useState(false);
  const [complaintId,       setComplaintId]       = useState('');
  const [selectedDept,      setSelectedDept]      = useState('');

  const openModal = (dept = '') => {
    setSelectedDept(dept);
    setIsPrivacyModalOpen(true);
  };

  const handlePrivacyAccept = () => {
    setIsPrivacyModalOpen(false);
    setIsModalOpen(true);
  };

  const closePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
    setSelectedDept('');
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (data) => {
    try {
      const response = await api.createComplaint({
        studentId:   currentUser.email,
        department:  data.dept,
        category:    'General',
        subject:     data.subject,
        description: data.description,
        imageData:   data.imageData
      });

      const code = response.complaintCode || 'TEMP-CODE';
      setComplaintId(code);
      localStorage.setItem('lastComplaintId', code);
      setIsModalOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error('Failed to create complaint', error);
      alert('Failed to submit complaint. Please check your backend.');
    }
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSelectedDept('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {/* Top Nav Bar */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-slate-900">College Complaint Portal</h1>
          <p className="text-xs text-slate-500">Student Portal</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors text-sm font-medium"
          >
            <User size={16} />
            <span className="hidden sm:inline">{currentUser.fullName}</span>
            <span className="sm:hidden">Profile</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="w-full max-w-4xl p-4 flex flex-col items-center">
        <Header onTrackClick={() => setIsTrackModalOpen(true)} />

        <DashboardMenu
          onRaiseComplaint={() => openModal()}
          onTrackComplaint={() => setIsTrackModalOpen(true)}
          onHistory={() => setIsHistoryModalOpen(true)}
        />
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          studentUser={currentUser}
          onClose={() => setIsProfileOpen(false)}
          onProfileUpdated={(updated) => {
            setCurrentUser(prev => ({ ...prev, ...updated }));
          }}
        />
      )}

      {isPrivacyModalOpen && (
        <PrivacyConsentModal
          onAccept={handlePrivacyAccept}
          onCancel={closePrivacyModal}
        />
      )}

      {isModalOpen && (
        <ComplaintModal
          departments={departments}
          initialDept={selectedDept}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal
          complaintId={complaintId}
          department={selectedDept}
          onClose={closeSuccess}
        />
      )}

      {isTrackModalOpen && (
        <TrackComplaintModal
          onClose={() => setIsTrackModalOpen(false)}
        />
      )}

      {isHistoryModalOpen && (
        <HistoryModal
          onClose={() => setIsHistoryModalOpen(false)}
          studentEmail={currentUser.email}
        />
      )}
    </div>
  );
}

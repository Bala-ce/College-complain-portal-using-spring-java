// src/App.jsx
import { useState } from 'react';
import Header from './components/Header.jsx';
import DepartmentGrid from './components/DepartmentGrid.jsx';
import FloatingButton from './components/FloatingButton.jsx';
import ComplaintModal from './components/ComplaintModal.jsx';
import SuccessModal from './components/SuccessModal.jsx';
import TrackComplaintModal from './components/TrackComplaintModal.jsx';
import PrivacyConsentModal from './components/PrivacyConsentModal.jsx';
import DashboardMenu from './components/DashboardMenu.jsx';
import HistoryModal from './components/HistoryModal.jsx';

// Mock data for departments
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
  'Placement Cell'
  'Campus Maintenance & Facilities',
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('menu'); // 'menu' or 'departments'
  const [complaintId, setComplaintId] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [complaints, setComplaints] = useState([]);

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

  const handleSubmit = (data) => {
    // Generate a mock complaint ID
    const mockId = `#CMP-${Math.floor(100000 + Math.random() * 900000)}`;

    // Save to mock database
    setComplaints((prev) => [
      ...prev,
      {
        id: mockId,
        dept: data.dept,
        subject: data.subject,
        description: data.description,
        date: new Date().toISOString(),
      },
    ]);

    setComplaintId(mockId);
    setIsModalOpen(false);
    setIsSuccessOpen(true);
    setCurrentView('menu'); // return to main menu after success
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSelectedDept('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">
      <Header onTrackClick={() => setIsTrackModalOpen(true)} />
      
      {currentView === 'menu' ? (
        <DashboardMenu 
          onRaiseComplaint={() => setCurrentView('departments')}
          onTrackComplaint={() => setIsTrackModalOpen(true)}
          onHistory={() => setIsHistoryModalOpen(true)}
        />
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-lg mx-auto mb-4">
            <button 
              onClick={() => setCurrentView('menu')}
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              ← Back to Main Menu
            </button>
          </div>
          <DepartmentGrid departments={departments} onCardClick={openModal} />
          <FloatingButton onClick={() => openModal()} />
        </div>
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
        <HistoryModal onClose={() => setIsHistoryModalOpen(false)} />
      )}
    </div>
  );
}

export default App;

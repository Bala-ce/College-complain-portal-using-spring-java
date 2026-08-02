// src/App.jsx
import { useState } from 'react';
import Header from './components/Header.jsx';
import DepartmentGrid from './components/DepartmentGrid.jsx';
import FloatingButton from './components/FloatingButton.jsx';
import ComplaintModal from './components/ComplaintModal.jsx';
import SuccessModal from './components/SuccessModal.jsx';
import TrackComplaintModal from './components/TrackComplaintModal.jsx';
import PrivacyConsentModal from './components/PrivacyConsentModal.jsx';

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
  'Campus Maintenance & Facilities',
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
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
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSelectedDept('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">
      <Header onTrackClick={() => setIsTrackModalOpen(true)} />
      <DepartmentGrid departments={departments} onCardClick={openModal} />
      <FloatingButton onClick={() => openModal()} />

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
          complaints={complaints}
        />
      )}
    </div>
  );
}

export default App;

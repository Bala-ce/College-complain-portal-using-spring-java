// src/App.jsx
<<<<<<< HEAD
import { useState } from 'react';
import { api } from './services/api.js';
import Header from './components/Header.jsx';
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
  'Placement Cell',
  'Campus Maintenance & Facilities',
  'Student Misbehavior'
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
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

  const handleSubmit = async (data) => {
    try {
      const response = await api.createComplaint({
        studentId: "STU001", // Using a default student ID
        department: data.dept,
        category: "General",
        subject: data.subject,
        description: data.description,
        imageData: data.imageData
      });

      setComplaintId(response.complaintCode);
      localStorage.setItem('lastComplaintId', response.complaintCode);

      setComplaints((prev) => [
        ...prev,
        response
      ]);

      setIsModalOpen(false);
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Failed to create complaint", error);
      alert("Failed to submit complaint. Please check your backend.");
    }
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSelectedDept('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">
      <Header onTrackClick={() => setIsTrackModalOpen(true)} />

      <DashboardMenu
        onRaiseComplaint={() => openModal()}
        onTrackComplaint={() => setIsTrackModalOpen(true)}
        onHistory={() => setIsHistoryModalOpen(true)}
      />

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
=======
import AdminDashboard from './components/AdminDashboard.jsx';

function App() {
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <AdminDashboard 
      adminUser={{ name: "Dr. Sharma", role: "ADMIN", department: "All Departments" }}
      onLogout={handleLogout}
    />
>>>>>>> AdminDashboard-features
  );
}

export default App;

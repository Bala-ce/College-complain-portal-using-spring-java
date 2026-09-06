// src/App.jsx
import { useState } from 'react';
import LoginPage from './components/LoginPage.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Called by LoginPage after a successful login or registration
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Not logged in → show login/register page
  if (currentUser === null) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Admin roles → AdminDashboard
  if (currentUser.role === 'DEPT_ADMIN' || currentUser.role === 'SUPER_ADMIN') {
    return (
      <AdminDashboard
        adminUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Student role → StudentDashboard
  if (currentUser.role === 'STUDENT') {
    return (
      <StudentDashboard
        studentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Fallback for unknown roles
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Unknown Role</h2>
        <p className="text-slate-500 mb-4">Your account has an unrecognised role: <code>{currentUser.role}</code></p>
        <button
          onClick={handleLogout}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default App;

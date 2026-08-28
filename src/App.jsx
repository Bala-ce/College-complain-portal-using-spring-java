// src/App.jsx
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
  );
}

export default App;

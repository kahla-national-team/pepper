import React from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import Dashboard from '../components/Dashboard/Dashboard';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <main className="admin-dashboard-content">
        <Dashboard />
      </main>
    </div>
  );
};

export default AdminDashboard; 
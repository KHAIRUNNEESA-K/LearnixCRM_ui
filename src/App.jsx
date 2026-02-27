import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import LeadManagement from './pages/Admin/LeadManagement';
import TeamManagement from './pages/Admin/TeamManagement';
import Admissions from './pages/Admin/Admissions';
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import SalesDashboard from './pages/Sales/SalesDashboard';
import SalesAnalytics from './pages/Admin/SalesAnalytics';
import SystemLogs from './pages/Admin/SystemLogs';
import Reports from './pages/Admin/Reports';
import Profile from './pages/Admin/Profile';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} limit={1} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/leads" element={<LeadManagement />} />
          <Route path="/admin/team" element={<TeamManagement />} />
          <Route path="/admin/admissions" element={<Admissions />} />
          <Route path="/admin/analytics" element={<SalesAnalytics />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/logs" element={<SystemLogs />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/sales" element={<SalesDashboard />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

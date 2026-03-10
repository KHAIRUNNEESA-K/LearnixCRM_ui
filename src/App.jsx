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
import ManagerLeadManagement from './pages/Manager/ManagerLeadManagement';
import ManagerTeamManagement from './pages/Manager/ManagerTeamManagement';
import ManagerAdmissions from './pages/Manager/ManagerAdmissions';
import ManagerReports from './pages/Manager/ManagerReports';
import LeadAssign from './pages/Manager/LeadAssign';
import ManagerSalesAnalytics from './pages/Manager/ManagerSalesAnalytics';
import SalesDashboard from './pages/Sales/SalesDashboard';
import SalesLeads from './pages/Sales/SalesLeads';
import SalesFollowups from './pages/Sales/SalesFollowups';
import SalesStudents from './pages/Sales/SalesStudents';
import SalesBlacklist from './pages/Sales/SalesBlacklist';
import SalesReports from './pages/Sales/SalesReports';
import SalesAnalytics from './pages/Admin/SalesAnalytics';
import SystemLogs from './pages/Admin/SystemLogs';
import Reports from './pages/Admin/Reports';
import Profile from './pages/Admin/Profile';
import CourseManagement from './pages/Admin/CourseManagement';
import SetPassword from './pages/Auth/SetPassword';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} limit={1} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/leads" element={<LeadManagement />} />
          <Route path="/admin/team" element={<TeamManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/admissions" element={<Admissions />} />
          <Route path="/admin/analytics" element={<SalesAnalytics />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/logs" element={<SystemLogs />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/leads" element={<ManagerLeadManagement />} />
          <Route path="/manager/team" element={<ManagerTeamManagement />} />
          <Route path="/manager/admissions" element={<ManagerAdmissions />} />
          <Route path="/manager/reports" element={<ManagerReports />} />
          <Route path="/manager/assign" element={<LeadAssign />} />
          <Route path="/manager/analytics" element={<ManagerSalesAnalytics />} />
          <Route path="/sales" element={<SalesDashboard />} />
          <Route path="/sales/leads" element={<SalesLeads />} />
          <Route path="/sales/followups" element={<SalesFollowups />} />
          <Route path="/sales/students" element={<SalesStudents />} />
          <Route path="/sales/blacklist" element={<SalesBlacklist />} />
          <Route path="/sales/reports" element={<SalesReports />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

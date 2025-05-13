import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Layout from './layout/Layout';
import AdminPanel from './pages/AdminPanel';
import Agent from './pages/Agent';
import AgentProfile from './pages/AgentProfile';
import StudentTable from './pages/Student';
import StudentProfile from './pages/Studentprofile';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminSettings from './pages/AdminSetting/AdminSettings';
import AdminPermission from './pages/AdminSetting/AdminPermission';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - blocked if user is already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin" replace />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="agent" element={<Agent />} />
          <Route path="students" element={<Agent />} />
          <Route path="universities" element={<Agent />} />
          <Route path="application" element={<Agent />} />
          <Route path="commission" element={<Agent />} />
          <Route path="tasks" element={<Agent />} />
          <Route path="trainhub" element={<Agent />} />
          <Route path="growth" element={<Agent />} />
          <Route path="tests" element={<Agent />} />
          <Route path="reports" element={<Agent />} />
          <Route path="loan" element={<Agent />} />
          <Route path="gic" element={<Agent />} />
          <Route path="help" element={<Agent />} />
          <Route path="agentprofile" element={<AgentProfile />} />
          <Route path="student" element={<StudentTable />} />
          <Route path="StudentProfile" element={<StudentProfile />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/settings/roles" element={<AdminPermission />} />

          {/* Add other protected routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

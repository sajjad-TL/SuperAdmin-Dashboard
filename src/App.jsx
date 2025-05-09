import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Layout from './layout/Layout';
import AdminPanel from './pages/AdminPanel';
import Agent from './pages/Agent';
import AgentProfile from './pages/AgentProfile';
import StudentTable from './pages/Student';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Layout with Sidebar */}
        <Route path="/" element={<Layout />}>
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
          {/* Add other protected routes here */}
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

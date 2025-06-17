import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Layout from './layout/Layout';
import AdminPanel from './pages/AdminPanel';
import Agent from './pages/Agent';
import AgentProfile from './pages/AgentProfile';
import StudentTable from './pages/Student';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import StudentProfile from './pages/StudentProfile';
import Application from './pages/Application';
import AdminSettings from './pages/AdminSetting/AdminSettings';
import AdminPermission from './pages/AdminSetting/AdminPermission';
import AdminEmail from './pages/AdminSetting/AdminEmail';
import NotificationPage from './pages/NotificationPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPlatform from './pages/AdminSetting/AdminPlatform';
import Trainhub from './pages/Trainhub';
import Report from './pages/Report';
import Comission from './pages/Comission';
import PaymentRequests from './pages/PaymentRequests';
import PaymentHistory from './pages/PaymentHistory';
import PaymentProfile from './pages/PaymentProfile';
import NewPayment from './pages/NewPayment';
import Register from './pages/auth/Register'

function App() {
  return (

    <><ToastContainer position="top-right" autoClose={3000} />
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
          <Route path="/forgot-password" element={<PublicRoute>
            <ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute>
            <ResetPassword /></PublicRoute>} />

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
            <Route path="application" element={<Application />} />
            <Route path="tasks" element={<Agent />} />
            <Route path="trainhub" element={<Trainhub />} />
            <Route path="growth" element={<Agent />} />
            <Route path="tests" element={<Agent />} />
            <Route path="reports" element={<Report />} />
            <Route path="loan" element={<Agent />} />
            <Route path="gic" element={<Agent />} />
            <Route path="help" element={<Agent />} />
            <Route path="agentprofile/:agentId" element={<AgentProfile />} />
            <Route path="student" element={<StudentTable />} />
            <Route path="/studentprofile/:studentId" element={<StudentProfile />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/settings/roles" element={<AdminPermission />} />
            <Route path="/settings/email" element={<AdminEmail />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/settings/rules" element={<AdminPlatform />} />
            <Route path="/payment-requests" element={<PaymentRequests />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/commisionprofile" element={<PaymentProfile />} />
            <Route path="/newpayment" element={<NewPayment />} />
            <Route path="commission" element={<Comission />} />
            <Route path="/create-agent" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}


export default App;

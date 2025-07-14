import './index.css'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AuthRedirect from './components/AuthRedirect'

import AdminLogin from './pages/auth/loginAdmin'
import DeveloperLogin from './pages/auth/loginDeveloper'
import UserLogin from './pages/auth/loginuser'
import DeveloperRegister from './pages/auth/registerDevoper'
import UserRegister from './pages/auth/userregister'

import  AdminLayout  from '../src/layout/AdminLayout'
import UserLayout from '../src/layout/UserLayout'
import DeveloperLayout from '../src/layout/DeveloperLayout'

import AdminDashbaord from './pages/admin/Dashboard'
import FinancialsPage from './pages/admin/Financials'
import ProjectManagementPage from './pages/admin/Projectmanagement'
import UserManagementPage from './pages/admin/UserManagement'
import SettingsPage from './pages/admin/SettingsPage'
import AdminEarnings from './pages/admin/AdminEarnings'

import UserDashboard from './pages/User/Dashboard'
import PostJob from './pages/User/PostJob'
import Jobs from './pages/User/Jobs'
import HireDeveloper from './pages/User/HireDeveloper'
import MyRequests from './pages/User/MyRequests'
import UserNotifications from './pages/User/Notifications'
import UserPayments from './pages/User/Payments'
import UserProfile from './pages/User/Profile'
import UserProposals from './pages/User/Proposals'

import DeveloperDashboard from './pages/Developer/Dashboard'
import DeveloperJobs from './pages/Developer/Jobs'
import DeveloperJobRequests from './pages/Developer/JobRequests'
import DeveloperNotifications from './pages/Developer/Notifications'
import DeveloperPayments from './pages/Developer/Payments'
import DeveloperReviews from './pages/Developer/Reviews'
import DeveloperProfile from './pages/Developer/Profile'
import DeveloperProposals from './pages/Developer/Proposals'
import Homepage from './pages/Homepage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/login" element={<Navigate to="/login/user" replace />} />
          <Route path="/register" element={<Navigate to="/register/user" replace />} />
          <Route path="/login/admin" element={<AuthRedirect><AdminLogin /></AuthRedirect>} />
          <Route path="/login/developer" element={<AuthRedirect><DeveloperLogin /></AuthRedirect>} />
          <Route path="/login/user" element={<AuthRedirect><UserLogin /></AuthRedirect>} />
          <Route path="/register/developer" element={<AuthRedirect><DeveloperRegister /></AuthRedirect>} />
          <Route path="/register/user" element={<AuthRedirect><UserRegister /></AuthRedirect>} />
          
          <Route path='/admin' element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path='dashboard' element={<AdminDashbaord />} />
            <Route path='financials' element={<FinancialsPage />} />
            <Route path='project' element={<ProjectManagementPage />} />
            <Route path='users' element={<UserManagementPage />} />
            <Route path='earnings' element={<AdminEarnings />} />
            <Route path='setting' element={<SettingsPage />} />
          </Route>

          <Route path='/user' element={
            <ProtectedRoute requiredRole="user">
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path='dashboard' element={<UserDashboard />} />
            <Route path='hire-developer' element={<HireDeveloper />} />
            <Route path='post-job' element={<PostJob />} />
            <Route path='jobs' element={<Jobs />} />
            <Route path='proposals' element={<UserProposals />} />
            <Route path='payments' element={<UserPayments />} />
            <Route path='notifications' element={<UserNotifications />} />
            <Route path='profile' element={<UserProfile />} />
          </Route>

          <Route path='/developer' element={
            <ProtectedRoute requiredRole="developer">
              <DeveloperLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path='dashboard' element={<DeveloperDashboard />} />
            <Route path='my-jobs' element={<DeveloperJobs />} />
            <Route path='job-requests' element={<DeveloperJobRequests />} />
            <Route path='proposals' element={<DeveloperProposals />} />
            <Route path='payments' element={<DeveloperPayments />} />
            <Route path='reviews' element={<DeveloperReviews />} />
            <Route path='profile' element={<DeveloperProfile />} />
            <Route path='notifications' element={<DeveloperNotifications />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

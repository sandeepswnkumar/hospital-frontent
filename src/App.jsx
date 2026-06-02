import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import PatientLogin from './pages/auth/PatientLogin';
import StaffLogin from './pages/auth/StaffLogin';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ListingPage from './pages/shared/ListingPage';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';

// Staff Pages
import StaffAppointments from './pages/staff/StaffAppointments';
import StaffPayments from './pages/staff/StaffPayments';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import AddFamilyMember from './pages/patient/AddFamilyMember';
import MakeAppointment from './pages/patient/MakeAppointment';
import PatientLayout from './layouts/PatientLayout';
import ConfirmBooking from './pages/patient/ConfirmBooking';
import StaffDashboard from './pages/dashboards/StaffDashboard';
import AdminPageLayout from './layouts/AdminPageLayout';
import Patients from './pages/patient/Listing/Patients';

// Shared Pages
import NotFound from './pages/shared/NotFound';
import Offline from './pages/shared/Offline';
import Hospitals from './pages/Hospital/Listing/Hospitals';
import CreateHospital from './pages/Hospital/CreateHospital';
import EditHospital from './pages/Hospital/EditHospital';
import Doctors from './pages/doctor/Listing/Doctors';
import CreateDoctor from './pages/doctor/CreateDoctor';
import EditDoctor from './pages/doctor/EditDoctor';

// Dynamic landing page redirect based on role
const RootRedirect = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'Patient') return <Navigate to="/patient/dashboard" replace />;
      if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
      if (user.role === 'Doctor') return <Navigate to="/doctor/dashboard" replace />;
      if (user.role === 'Staff') return <Navigate to="/staff/dashboard" replace />;
    } catch (err) {
      console.error("Failed to parse user redirect", err);
    }
  }
  return <Navigate to="/patient-login" replace />;
};

// Global Offline Detection Wrapper
function OfflineDetector({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOffline = () => {
      if (location.pathname !== '/offline') {
        navigate(`/offline?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      }
    };

    window.addEventListener('offline', handleOffline);

    // Also check initial state
    if (!navigator.onLine && location.pathname !== '/offline') {
      handleOffline();
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, [location.pathname, location.search, navigate]);

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <OfflineDetector>
        <Routes>
          {/* Public Routes */}
          <Route path="/page" element={<AdminPageLayout />} />
          <Route path="/" element={<RootRedirect />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/offline" element={<Offline />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminPageLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="patients" element={<Patients entity="Patients" role="Admin" />} />
            <Route path="hospitals" element={<Hospitals entity="Hospitals" role="Admin" />} />
            <Route path="hospital/create" element={<CreateHospital entity="Hospitals" role="Admin" />} />
            <Route path="hospital/:id" element={<EditHospital entity="Hospitals" role="Admin" />} />
            <Route path="doctors" element={<Doctors entity="Doctors" role="Admin" />} />
            <Route path="doctor/create" element={<CreateDoctor entity="Doctors" role="Admin" />} />
            <Route path="doctor/:id" element={<EditDoctor entity="Doctors" role="Admin" />} />
            <Route path="appointments" element={<StaffDashboard entity="Appointments" role="Admin" />} />
            <Route path="payments" element={<ListingPage entity="Payments" role="Admin" />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={<ProtectedRoute allowedRoles={['Doctor', 'Admin']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="patients" element={<ListingPage entity="Patients" role="Doctor" />} />
          </Route>

          {/* Staff Routes */}
          <Route path="/staff" element={<ProtectedRoute allowedRoles={['Staff', 'Admin']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="appointments" element={<ListingPage entity="Appointments" role="Staff" />} />
            <Route path="payments" element={<ListingPage entity="Payments" role="Staff" />} />
          </Route>

          {/* Patient Routes */}
          <Route path="/patient" element={<ProtectedRoute allowedRoles={['Patient']}><PatientLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="add-member" element={<AddFamilyMember />} />
            <Route path="make-appointment" element={<MakeAppointment />} />
            <Route path="confirm-booking" element={<ConfirmBooking />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </OfflineDetector>
    </BrowserRouter>
  );
}

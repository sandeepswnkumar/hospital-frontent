import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import DoctorPatients from './pages/doctor/DoctorPatients';

// Staff Pages
// import StaffDashboard from './pages/staff/StaffDashboard';
import StaffAppointments from './pages/staff/StaffAppointments';
import StaffPayments from './pages/staff/StaffPayments';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import AddFamilyMember from './pages/patient/AddFamilyMember';
import MakeAppointment from './pages/patient/MakeAppointment';
import PatientLayout from './layouts/PatientLayout';
import ConfirmBooking from './pages/patient/ConfirmBooking';
import StaffDashboard from './pages/dashboards/StaffDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/patient-login" replace />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="patients" element={<ListingPage entity="Patients" role="Admin" />} />
          <Route path="appointments" element={<StaffDashboard entity="Appointments" role="Admin" />} />
          {/* <Route path="appointments" element={<ListingPage entity="Appointments" role="Admin" />} /> */}
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

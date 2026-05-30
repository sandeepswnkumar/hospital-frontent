import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, allowedRoles }) {
  const userStr = localStorage.getItem('user');

  if (!userStr) {
    // If no user, redirect to some default login.
    // If accessing a patient route, redirect to patient-login; otherwise to staff-login.
    const isPatientRoute = allowedRoles && allowedRoles.includes('Patient');
    return <Navigate to={isPatientRoute ? "/patient-login" : "/staff-login"} replace />;
  }

  const user = JSON.parse(userStr);

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user doesn't have permission, redirect to their own dashboard
    if (user.role === 'Patient') return <Navigate to="/patient/dashboard" replace />;
    if (user.role === 'Doctor') return <Navigate to="/doctor/dashboard" replace />;
    if (user.role === 'Staff') return <Navigate to="/staff/dashboard" replace />;
    if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;

    return <Navigate to="/staff-login" replace />;
  }

  return children;
}

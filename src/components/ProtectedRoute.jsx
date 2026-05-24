import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, allowedRoles }) {
  // In a real app, you would get this from Context or Redux
  const userStr = localStorage.getItem('user');

  if (!userStr) {
    // If no user, redirect to some default login. 
    // We can assume StaffLogin for generic fallback, but ideally we'd know which one they wanted.
    return <Navigate to="/staff-login" replace />;
  }

  const user = JSON.parse(userStr);
  console.log("user ", user)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user doesn't have permission, redirect to their own dashboard
    console.log("user.role ", user.role)
    if (user.role === 'Patient') return <Navigate to="/patient/dashboard" replace />;
    if (user.role === 'Doctor') return <Navigate to="/doctor/dashboard" replace />;
    if (user.role === 'Staff') return <Navigate to="/staff/dashboard" replace />;
    if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;

    return <Navigate to="/staff-login" replace />;
  }

  return children;
}

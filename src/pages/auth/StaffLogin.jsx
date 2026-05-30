import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '@/assets/assets';

export default function StaffLogin() {
  const [formData, setFormData] = useState({
    email: 'sandeep@rest.com',
    password: 'dsdsd1',
    role: 'admin', // 'admin' | 'doctor' | 'staff'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // ─── Auto-redirect if already logged in ───
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'Patient') navigate('/patient/dashboard', { replace: true });
        else if (user.role === 'Admin') navigate('/admin/dashboard', { replace: true });
        else if (user.role === 'Doctor') navigate('/doctor/dashboard', { replace: true });
        else if (user.role === 'Staff') navigate('/staff/dashboard', { replace: true });
      } catch (err) {
        console.error("Failed to parse user role", err);
      }
    }
  }, [navigate]);

  // ─── Handlers ───
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Dynamically resolve role from email to allow easy testing of multiple roles
    let selectedRole = 'Admin';
    if (formData.email.toLowerCase().includes('doctor')) {
      selectedRole = 'Doctor';
    } else if (formData.email.toLowerCase().includes('staff')) {
      selectedRole = 'Staff';
    } else if (formData.email.toLowerCase().includes('patient')) {
      selectedRole = 'Patient';
    } else if (formData.role) {
      selectedRole = formData.role.charAt(0).toUpperCase() + formData.role.slice(1);
    }

    localStorage.setItem("user", JSON.stringify({ role: selectedRole }));
    
    if (selectedRole === 'Patient') navigate("/patient/dashboard");
    else if (selectedRole === 'Doctor') navigate("/doctor/dashboard");
    else if (selectedRole === 'Staff') navigate("/staff/dashboard");
    else navigate("/admin/dashboard");
  };



  // ─── Role Options ───
  const roles = [
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: '👤' },
    { value: 'doctor', label: 'Doctor', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: '👨‍⚕️' },
    { value: 'staff', label: 'Staff', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: '🏥' },
  ];

  // ─── Render ───
  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-5" style={{ backgroundImage: `url(${assets.images.adminLoginBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-5 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <ShieldIcon />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">MediCare Hospital</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Staff Portal</p>
        </div>

        {/* Role Selector */}
        {/* <div className="mb-5 sm:mb-6">
          <label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-2.5 block">Select Role</label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, role: role.value }));
                  setError('');
                }}
                className={`flex flex-col items-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 px-2 rounded-xl border-2 transition-all duration-200 ${formData.role === role.value
                  ? `${role.color} ring-2 ring-offset-1 ring-slate-300`
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
              >
                <span className="text-lg sm:text-xl">{role.icon}</span>
                <span className="text-[10px] sm:text-xs font-semibold">{role.label}</span>
              </button>
            ))}
          </div>
        </div> */}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm mb-4 sm:mb-5 border border-red-200">
            <ErrorIcon />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-[3px] border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-xs sm:text-sm">Authenticating...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">Email Address</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-600 transition-colors bg-white">
                <div className="pl-3 sm:pl-4">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@medicare.com"
                  className="flex-1 px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">Password</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-600 transition-colors bg-white">
                <div className="pl-3 sm:pl-4">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="flex-1 px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 sm:pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs sm:text-sm text-slate-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-xs sm:text-sm text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/25 active:translate-y-0"
            >
              Login as {roles.find(r => r.value === formData.role)?.label}
              <ArrowRightIcon />
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-slate-200 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            Are you a patient?{' '}
            <a href="/patient-login" className="text-emerald-600 font-semibold hover:underline">
              Patient Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Icons ───
const ShieldIcon = () => (
  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

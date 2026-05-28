import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  LogOut, 
  Stethoscope, 
  Menu 
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'Guest';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/staff-login');
  };

  const navLinks = [
    { name: 'Dashboard', path: `/${role.toLowerCase()}/dashboard`, icon: LayoutDashboard, roles: ['Admin', 'Doctor', 'Staff', 'Patient'] },
    { name: 'Patients', path: `/${role.toLowerCase()}/patients`, icon: Users, roles: ['Admin', 'Doctor'] },
    { name: 'Appointments', path: `/${role.toLowerCase()}/appointments`, icon: Calendar, roles: ['Admin', 'Staff'] },
    { name: 'Payments', path: `/${role.toLowerCase()}/payments`, icon: CreditCard, roles: ['Admin', 'Staff'] },
  ].filter(link => link.roles.includes(role));

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#0f1015] flex text-left relative text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-blue-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-teal-500/5 blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-[#191c24] border-r border-slate-200 dark:border-slate-800/60
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col z-10
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/60">
          <Stethoscope className="w-6 h-6 text-teal-500 mr-2" />
          <span className="font-black text-lg tracking-widest text-slate-800 dark:text-white">CORONA</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all
                ${isActive 
                  ? 'bg-slate-100 dark:bg-[#0f1015] text-slate-900 dark:text-white border-l-4 border-blue-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                }
              `}
              end
            >
              <link.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center px-3 py-2 mb-4 bg-slate-50 dark:bg-black/20 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-slate-250 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-white font-bold mr-3">
              {role.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{role} User</p>
              <p className="text-xs text-slate-450 dark:text-slate-500 truncate w-32">{user?.email || user?.mobile}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <header className="h-16 bg-white dark:bg-[#191c24] border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

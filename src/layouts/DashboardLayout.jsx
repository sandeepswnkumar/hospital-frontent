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
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 flex text-left">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Stethoscope className="w-6 h-6 text-teal-600 dark:text-teal-400 mr-2" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">CareConnect</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }
              `}
              end
            >
              <link.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center px-3 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold mr-3">
              {role.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{role} User</p>
              <p className="text-xs text-slate-500 truncate w-32">{user?.email || user?.mobile}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 flex justify-end">
            {/* Add header items here like notifications */}
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

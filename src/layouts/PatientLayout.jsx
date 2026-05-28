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

export default function PatientLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user?.role || 'Patient';

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
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-[#0f1015] flex flex-col text-left relative text-slate-800 dark:text-slate-100 transition-colors duration-300">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-blue-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-teal-500/5 blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
            </div>

            {/* Header */}
            <header className="h-16 bg-white dark:bg-[#191c24] border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-10">
                <div className="flex items-center">
                    <Stethoscope className="w-6 h-6 text-teal-500 mr-2" />
                    <span className="font-black text-lg tracking-widest text-slate-800 dark:text-white">CORONA</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-650 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/30" 
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

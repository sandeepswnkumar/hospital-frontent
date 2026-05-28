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
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 flex flex-col text-left">
            {/* Header */}
            <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
                <div className="flex items-center">
                    <Stethoscope className="w-6 h-6 text-teal-600 dark:text-teal-400 mr-2" />
                    <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">CareConnect</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/30" 
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

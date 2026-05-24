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
        <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 flex text-left">



            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>


            </div>
        </div>
    );
}

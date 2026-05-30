import React, { useState, useMemo } from 'react';
import {
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Calendar,
    MapPin,
    Phone,
    Stethoscope,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Filter
} from 'lucide-react';
import StatusBadge from '@/components/ui/status-badge';

const MOCK_APPOINTMENTS = [
    { id: '1', patient: 'Ravi Kumar', age: 45, phone: '+91 98765 43210', time: '09:00', doctor: 'Dr. Sharma', dept: 'Cardiology', room: '302-A', status: 'checked-in', type: 'Follow-up', date: '2026-05-24' },
    { id: '2', patient: 'Priya Patel', age: 32, phone: '+91 87654 32109', time: '09:15', doctor: 'Dr. Nair', dept: 'Dermatology', room: '205-B', status: 'pending', type: 'New', date: '2026-05-24' },
    { id: '3', patient: 'Amit Singh', age: 28, phone: '+91 76543 21098', time: '09:30', doctor: 'Dr. Sharma', dept: 'Cardiology', room: '302-A', status: 'completed', type: 'Follow-up', date: '2026-05-24' },
    { id: '4', patient: 'Sunita Devi', age: 62, phone: '+91 65432 10987', time: '10:00', doctor: 'Dr. Gupta', dept: 'Orthopedics', room: '401-C', status: 'pending', type: 'New', date: '2026-05-24' },
    { id: '5', patient: 'Mohammed Ali', age: 55, phone: '+91 54321 09876', time: '10:00', doctor: 'Dr. Sharma', dept: 'Cardiology', room: '302-A', status: 'pending', type: 'Emergency', date: '2026-05-24' },
    { id: '6', patient: 'Lakshmi Iyer', age: 41, phone: '+91 43210 98765', time: '10:30', doctor: 'Dr. Nair', dept: 'Dermatology', room: '205-B', status: 'cancelled', type: 'New', date: '2026-05-24' },
    { id: '7', patient: 'Vikram Rao', age: 35, phone: '+91 32109 87654', time: '11:00', doctor: 'Dr. Gupta', dept: 'Orthopedics', room: '401-C', status: 'pending', type: 'Follow-up', date: '2026-05-24' },
    { id: '8', patient: 'Ananya Desai', age: 29, phone: '+91 21098 76543', time: '11:30', doctor: 'Dr. Mehta', dept: 'Pediatrics', room: '105-D', status: 'checked-in', type: 'New', date: '2026-05-24' },
    { id: '9', patient: 'Rajesh Khanna', age: 50, phone: '+91 10987 65432', time: '14:00', doctor: 'Dr. Sharma', dept: 'Cardiology', room: '302-A', status: 'pending', type: 'Follow-up', date: '2026-05-24' },
    { id: '10', patient: 'Fatima Begum', age: 38, phone: '+91 09876 54321', time: '14:30', doctor: 'Dr. Nair', dept: 'Dermatology', room: '205-B', status: 'pending', type: 'New', date: '2026-05-24' },
    { id: '11', patient: 'Karan Malhotra', age: 19, phone: '+91 98765 12345', time: '15:00', doctor: 'Dr. Mehta', dept: 'Pediatrics', room: '105-D', status: 'pending', type: 'New', date: '2026-05-25' },
    { id: '12', patient: 'Deepa Joshi', age: 67, phone: '+91 87654 23456', time: '16:00', doctor: 'Dr. Gupta', dept: 'Orthopedics', room: '401-C', status: 'pending', type: 'Follow-up', date: '2026-05-25' },
];

const STATUS_STYLES = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Pending' },
    'checked-in': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', label: 'Checked In' },
    completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', label: 'Completed' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'Cancelled' },
};

const TYPE_STYLES = {
    New: 'bg-purple-100 text-purple-700',
    'Follow-up': 'bg-slate-100 text-slate-600',
    Emergency: 'bg-red-100 text-red-700',
};

export default function AppointmentsManager() {
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApt, setSelectedApt] = useState(null);
    const itemsPerPage = 8;

    // Filter logic
    const filteredApts = useMemo(() => {
        let filtered = appointments;

        if (statusFilter !== 'all') filtered = filtered.filter(a => a.status === statusFilter);
        if (dateFilter !== 'all') filtered = filtered.filter(a => a.date === dateFilter);

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(a =>
                a.patient.toLowerCase().includes(q) ||
                a.doctor.toLowerCase().includes(q) ||
                a.dept.toLowerCase().includes(q) ||
                a.phone.includes(q)
            );
        }

        return filtered.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    }, [appointments, statusFilter, dateFilter, searchQuery]);

    const totalPages = Math.ceil(filteredApts.length / itemsPerPage);
    const paginatedApts = filteredApts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const updateStatus = (id, newStatus) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    };

    const stats = useMemo(() => ({
        total: appointments.filter(a => a.status !== 'cancelled').length,
        pending: appointments.filter(a => a.status === 'pending').length,
        checkedIn: appointments.filter(a => a.status === 'checked-in').length,
        completed: appointments.filter(a => a.status === 'completed').length,
    }), [appointments]);

    return (
        <div className="w-full">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <StatCard label="Total" value={stats.total} color="bg-blue-600" />
                <StatCard label="Pending" value={stats.pending} color="bg-amber-500" />
                <StatCard label="Checked In" value={stats.checkedIn} color="bg-blue-500" />
                <StatCard label="Completed" value={stats.completed} color="bg-green-500" />
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="Search patients, doctors, departments..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={dateFilter}
                        onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">All Dates</option>
                        <option value="2026-05-24">Today (May 24)</option>
                        <option value="2026-05-25">Tomorrow (May 25)</option>
                    </select>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {['all', 'pending', 'checked-in', 'completed', 'cancelled'].map(s => (
                    <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === s
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                            }`}
                    >
                        {s === 'all' ? 'All' : STATUS_STYLES[s]?.label}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                    Showing <span className="font-semibold text-slate-800">{paginatedApts.length}</span> of <span className="font-semibold text-slate-800">{filteredApts.length}</span>
                </p>
                <div className="hidden sm:flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-40"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-medium text-slate-600">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-40"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Patient</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Doctor</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Time</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedApts.map(apt => (
                            <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                                            {apt.patient.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{apt.patient}</p>
                                            <p className="text-xs text-slate-500">{apt.age} yrs • {apt.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900">{apt.doctor}</p>
                                    <p className="text-xs text-slate-500">{apt.dept} • {apt.room}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900">{apt.time}</p>
                                    <p className="text-xs text-slate-500">{apt.date}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={apt.status} size="md" />
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${TYPE_STYLES[apt.type]}`}>
                                        {apt.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {apt.status === 'pending' && (
                                            <>
                                                <button onClick={() => updateStatus(apt.id, 'checked-in')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Check In">
                                                    <CheckCircle2 size={16} />
                                                </button>
                                                <button onClick={() => updateStatus(apt.id, 'cancelled')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Cancel">
                                                    <XCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                        {apt.status === 'checked-in' && (
                                            <button onClick={() => updateStatus(apt.id, 'completed')} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                                                Complete
                                            </button>
                                        )}
                                        <button onClick={() => setSelectedApt(apt)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
                {paginatedApts.map(apt => (
                    <MobileCard key={apt.id} apt={apt} onAction={updateStatus} onSelect={setSelectedApt} />
                ))}
            </div>

            {/* Mobile Pagination */}
            <div className="flex lg:hidden items-center justify-between mt-6">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium disabled:opacity-40"
                >
                    <ChevronLeft size={16} /> Prev
                </button>
                <span className="text-sm font-medium text-slate-600">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium disabled:opacity-40"
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>

            {/* Detail Modal */}
            {selectedApt && (
                <DetailModal apt={selectedApt} onClose={() => setSelectedApt(null)} onAction={updateStatus} />
            )}
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${color} mb-2`}></div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
    );
}

function MobileCard({ apt, onAction, onSelect }) {
    const status = STATUS_STYLES[apt.status];

    return (
        <div className={`bg-white rounded-2xl border ${status.border} p-4 shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
                        {apt.patient.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{apt.patient}</h3>
                        <p className="text-sm text-slate-500">{apt.age} yrs • {apt.dept}</p>
                    </div>
                </div>
                <StatusBadge status={apt.status} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={14} className="text-slate-400" />
                    <span className="font-semibold">{apt.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{apt.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <Stethoscope size={14} className="text-slate-400" />
                    <span>{apt.doctor}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{apt.room}</span>
                </div>
            </div>

            <div className="flex gap-2">
                {apt.status === 'pending' && (
                    <>
                        <button onClick={() => onAction(apt.id, 'checked-in')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold active:scale-95 transition-all">
                            <CheckCircle2 size={16} /> Check In
                        </button>
                        <button onClick={() => onAction(apt.id, 'cancelled')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold active:scale-95 transition-all">
                            <XCircle size={16} /> Cancel
                        </button>
                    </>
                )}
                {apt.status === 'checked-in' && (
                    <button onClick={() => onAction(apt.id, 'completed')} className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold active:scale-95 transition-all">
                        <CheckCircle2 size={16} /> Complete
                    </button>
                )}
                {(apt.status === 'completed' || apt.status === 'cancelled') && (
                    <button onClick={() => onSelect(apt)} className="w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold">
                        View Details
                    </button>
                )}
            </div>
        </div>
    );
}

function DetailModal({ apt, onClose, onAction }) {
    const status = STATUS_STYLES[apt.status];

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-100 p-4 rounded-t-3xl flex items-center justify-between">
                    <h3 className="font-bold text-lg">Appointment Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <XCircle size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">
                            {apt.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-slate-900">{apt.patient}</h2>
                            <p className="text-slate-500">{apt.age} years • {apt.phone}</p>
                        </div>
                    </div>

                    <StatusBadge status={apt.status} size="md" className="px-4 py-2 text-sm font-bold" />

                    <div className="grid grid-cols-2 gap-3">
                        <DetailItem icon={<Clock size={16} />} label="Time" value={apt.time} />
                        <DetailItem icon={<Calendar size={16} />} label="Date" value={apt.date} />
                        <DetailItem icon={<Stethoscope size={16} />} label="Doctor" value={apt.doctor} />
                        <DetailItem icon={<MapPin size={16} />} label="Room" value={apt.room} />
                        <DetailItem icon={<Phone size={16} />} label="Phone" value={apt.phone} />
                    </div>

                    <div className="flex gap-3 pt-2">
                        {apt.status === 'pending' && (
                            <>
                                <button onClick={() => { onAction(apt.id, 'checked-in'); onClose(); }} className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                                    Check In Patient
                                </button>
                                <button onClick={() => { onAction(apt.id, 'cancelled'); onClose(); }} className="flex-1 py-3.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100">
                                    Cancel
                                </button>
                            </>
                        )}
                        {apt.status === 'checked-in' && (
                            <button onClick={() => { onAction(apt.id, 'completed'); onClose(); }} className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">
                                Complete Appointment
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
            <div className="text-slate-400">{icon}</div>
            <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="font-semibold text-sm text-slate-800">{value}</p>
            </div>
        </div>
    );
}
import React, { useState } from 'react';
import {
  CalendarPlus,
  History,
  UserPlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  MapPin,
  Stethoscope,
  CheckCircle2,
  User,
  Bell,
  Shield,
  Star
} from 'lucide-react';
import BookAppointment from './BookAppointment';



const RECENT_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    specialty: 'Cardiology',
    rating: 4.9,
    visits: 3,
    color: 'bg-blue-500',
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    specialty: 'General Medicine',
    rating: 4.7,
    visits: 5,
    color: 'bg-emerald-500',
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    specialty: 'Dermatology',
    rating: 4.8,
    visits: 2,
    color: 'bg-violet-500',
  },
  {
    id: '4',
    name: 'Dr. Michael Brown',
    specialty: 'Orthopedics',
    rating: 4.6,
    visits: 1,
    color: 'bg-orange-500',
  },
];


const MOCK_UPCOMING = [
  { id: '1', doctor: 'Dr. Sarah Smith', specialty: 'Cardiology', date: 'Oct 24, 2026', time: '10:00 AM', location: 'Room 302, Block A' },
  { id: '2', doctor: 'Dr. James Wilson', specialty: 'Dentist', date: 'Nov 02, 2026', time: '02:30 PM', location: 'Room 105, Main Hall' },
  { id: '3', doctor: 'Dr. Emily Chen', specialty: 'Dermatology', date: 'Nov 15, 2026', time: '09:15 AM', location: 'Room 401, Block B' },
  { id: '4', doctor: 'Dr. Michael Brown', specialty: 'Orthopedics', date: 'Dec 01, 2026', time: '11:00 AM', location: 'Room 205, Block C' },
];

const MOCK_HISTORY = [
  { id: '1', doctor: 'Dr. Sarah Smith', specialty: 'Cardiology', date: 'Oct 24, 2026', time: '10:00 AM', location: 'Room 302, Block A', status: 'upcoming' },
  { id: '2', doctor: 'Dr. James Wilson', specialty: 'General Checkup', date: 'Sep 12, 2026', time: '02:30 PM', location: 'Room 105, Main Hall', status: 'completed' },
  { id: '3', doctor: 'Dr. Emily Chen', specialty: 'Dermatology', date: 'Aug 05, 2026', time: '09:15 AM', location: 'Room 401, Block B', status: 'completed' },
];

export default function PatientDashboard() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'book':
        return <BookAppointment onBack={() => setCurrentView('dashboard')} />;
      case 'history':
        return <BookingHistory onBack={() => setCurrentView('dashboard')} />;
      case 'add-patient':
        return <AddPatient onBack={() => setCurrentView('dashboard')} />;
      case 'profile':
        return <ProfileSettings onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {renderView()}
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header - Responsive */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-slate-500 text-sm font-medium">Welcome back,</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">John Doe</h1>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <User size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* Upcoming Bookings - Horizontal Scroll Carousel */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Upcoming Bookings</h2>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white shadow-md hover:bg-slate-50 text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white shadow-md hover:bg-slate-50 text-slate-600">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MOCK_UPCOMING.map((apt) => (
            <div
              key={apt.id}
              className="min-w-[280px] sm:min-w-[320px] bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-200 snap-start flex-shrink-0"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/20 p-2 rounded-xl">
                  <CalendarPlus size={20} />
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg">Upcoming</span>
              </div>
              <h3 className="text-lg font-bold mb-1">{apt.doctor}</h3>
              <p className="text-blue-100 text-sm mb-4">{apt.specialty}</p>
              <div className="flex items-center gap-4 text-sm font-medium bg-blue-700/30 p-3 rounded-2xl">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{apt.time}</span>
                </div>
                <div className="w-px h-4 bg-blue-400"></div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{apt.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* NEW: Recently Booked Doctors */}
      <RecentlyBookedDoctors />
      {/* Main Grid - Responsive */}
      <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-auto">
        <ActionCard
          icon={<CalendarPlus size={32} strokeWidth={1.5} />}
          label="Book Appointment"
          color="bg-blue-50 text-blue-600"
          onClick={() => onNavigate('book')}
        />
        <ActionCard
          icon={<History size={32} strokeWidth={1.5} />}
          label="Booking History"
          color="bg-indigo-50 text-indigo-600"
          onClick={() => onNavigate('history')}
        />
        <ActionCard
          icon={<UserPlus size={32} strokeWidth={1.5} />}
          label="Add Patient"
          color="bg-teal-50 text-teal-600"
          onClick={() => onNavigate('add-patient')}
        />
        <ActionCard
          icon={<Settings size={28} strokeWidth={1.5} />}
          label="Settings"
          color="bg-slate-100 text-slate-600"
          onClick={() => onNavigate('profile')}
          compact
        />
      </div>
    </div>
  );
}

function RecentlyBookedDoctors() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">Recently Booked Doctors</h2>
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {RECENT_DOCTORS.map((doctor) => (
          <div
            key={doctor.id}
            className="min-w-[260px] sm:min-w-[280px] bg-white rounded-3xl p-5 shadow-sm border border-slate-100 snap-start flex-shrink-0 flex flex-col gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${doctor.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl`}>
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">{doctor.name}</h3>
                <p className="text-sm text-slate-500">{doctor.specialty}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={16} fill="currentColor" />
                <span className="font-semibold text-slate-700">{doctor.rating}</span>
              </div>
              <span className="text-slate-400">{doctor.visits} visits</span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-100 active:scale-[0.98] transition-all">
              <CalendarPlus size={16} />
              Book Again
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionCard({ icon, label, color, onClick, compact }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start p-5 sm:p-6 rounded-3xl transition-transform active:scale-95 hover:shadow-md border border-transparent hover:border-slate-100 bg-white shadow-sm h-40 sm:h-48 justify-between`}
    >
      <div className={`p-3 rounded-2xl mb-3 ${color}`}>
        {icon}
      </div>
      <span className={`font-semibold text-slate-700 leading-tight text-lg sm:text-xl`}>
        {label}
      </span>
    </button>
  );
}

// function BookAppointment({ onBack }) {
//   const [selectedDept, setSelectedDept] = useState(null);

//   const departments = [
//     { name: 'General Medicine', icon: <Stethoscope size={20} /> },
//     { name: 'Cardiology', icon: <HeartIcon /> },
//     { name: 'Neurology', icon: <BrainIcon /> },
//     { name: 'Pediatrics', icon: <BabyIcon /> },
//     { name: 'Dermatology', icon: <Shield size={20} /> },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-white">
//       <div className="max-w-2xl mx-auto">
//         <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4">
//           <ChevronLeft size={20} />
//           <span className="font-medium">Back</span>
//         </button>
//         <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Book Appointment</h2>
//         <p className="text-slate-500 mb-6">Select a department to begin</p>

//         <div className="relative mb-6">
//           <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search doctor or condition..."
//             className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>

//         <h3 className="font-bold text-slate-800 mb-4">Departments</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {departments.map((dept) => (
//             <button
//               key={dept.name}
//               onClick={() => setSelectedDept(dept.name)}
//               className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${selectedDept === dept.name ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-100 bg-white hover:bg-slate-50'}`}
//             >
//               <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedDept === dept.name ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
//                 {dept.icon}
//               </div>
//               <span className="font-semibold text-slate-700 flex-1 text-left">{dept.name}</span>
//               <ChevronLeft className="rotate-180 text-slate-400" size={18} />
//             </button>
//           ))}
//         </div>

//         <div className="mt-8">
//           <h3 className="font-bold text-slate-800 mb-4">Available Slots</h3>
//           <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
//             {['09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM', '11:00 AM', '03:30 PM'].map(time => (
//               <button key={time} className="py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 active:bg-blue-50">
//                 {time}
//               </button>
//             ))}
//           </div>
//         </div>

//         <button className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform">
//           Confirm Booking
//         </button>
//       </div>
//     </div>
//   );
// }

function BookingHistory({ onBack }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4">
          <ChevronLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">History</h2>
        <p className="text-slate-500 mb-6">Your past and upcoming visits</p>

        <div className="space-y-4">
          {MOCK_HISTORY.map((apt) => (
            <div key={apt.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{apt.doctor}</h4>
                    <p className="text-sm text-slate-500">{apt.specialty}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                  apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl flex justify-between text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarPlus size={14} className="text-slate-400" />
                  <span>{apt.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <span>{apt.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddPatient({ onBack }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4">
          <ChevronLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Add Patient</h2>
        <p className="text-slate-500 mb-6">Register a new family member</p>

        <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto flex items-center justify-center text-slate-400 mb-4 border-4 border-white shadow-lg">
          <UserPlus size={40} />
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-lg" placeholder="e.g. Jane Doe" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Age</label>
              <input type="number" className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-lg" placeholder="Years" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Gender</label>
              <select className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-lg text-slate-600">
                <option>Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Relationship</label>
            <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-lg" placeholder="e.g. Spouse, Child" />
          </div>

          <button className="w-full mt-4 bg-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <CheckCircle2 size={20} />
            Save Patient
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ onBack }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4">
          <ChevronLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 mb-6">Manage your account</p>

        <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-3xl">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User size={32} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">John Doe</h3>
            <p className="text-slate-500 text-sm">john.doe@example.com</p>
          </div>
        </div>

        <div className="space-y-3">
          <SettingItem icon={<User size={20} />} label="Personal Information" />
          <SettingItem icon={<Bell size={20} />} label="Notifications" toggle />
          <SettingItem icon={<Shield size={20} />} label="Privacy & Security" />
          <SettingItem icon={<MapPin size={20} />} label="Saved Addresses" />

          <div className="pt-6">
            <button className="w-full py-4 rounded-2xl border border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ icon, label, toggle }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 cursor-pointer active:scale-[0.99] transition-all">
      <div className="flex items-center gap-4 text-slate-700">
        <div className="text-slate-400">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      {toggle ? (
        <div className="w-12 h-7 bg-blue-500 rounded-full relative">
          <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
        </div>
      ) : (
        <ChevronLeft className="rotate-180 text-slate-400" size={18} />
      )}
    </div>
  );
}

// --- Icon Helpers ---
function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function BabyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
      <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3 1 4 1.5" />
      <path d="M12 3a9 9 0 0 0-9 9 2 2 0 0 0 0 3.6 9 9 0 0 0 17.6 0 2 2 0 0 0 0-3.6 9 9 0 0 0-9-9" />
    </svg>
  );
}
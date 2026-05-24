import React, { useState } from 'react';
import { ChevronLeft, Search, Star, MapPin, Clock, DollarSign, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_SEARCH_RESULTS = [
    {
        hospital: 'Apollo Hospital',
        doctors: [
            {
                id: '1',
                name: 'Dr. Ravi Sharma',
                specialty: 'Cardiologist',
                experience: '15 years',
                rating: 4.9,
                reviews: 328,
                charge: 800,
                available: '10:00 AM - 02:00 PM',
                image: 'RS',
                color: 'bg-blue-500',
            },
            {
                id: '2',
                name: 'Dr. Ravi Patel',
                specialty: 'Orthopedic Surgeon',
                experience: '12 years',
                rating: 4.7,
                reviews: 215,
                charge: 600,
                available: '09:00 AM - 01:00 PM',
                image: 'RP',
                color: 'bg-emerald-500',
            },
        ],
    },
    {
        hospital: 'Fortis Healthcare',
        doctors: [
            {
                id: '3',
                name: 'Dr. Ravi Kumar',
                specialty: 'Neurologist',
                experience: '18 years',
                rating: 4.8,
                reviews: 412,
                charge: 1000,
                available: '11:00 AM - 04:00 PM',
                image: 'RK',
                color: 'bg-violet-500',
            },
            {
                id: '4',
                name: 'Dr. Ravi Gupta',
                specialty: 'General Physician',
                experience: '8 years',
                rating: 4.5,
                reviews: 156,
                charge: 400,
                available: '10:00 AM - 06:00 PM',
                image: 'RG',
                color: 'bg-orange-500',
            },
            {
                id: '5',
                name: 'Dr. Ravi Mehta',
                specialty: 'Dermatologist',
                experience: '10 years',
                rating: 4.6,
                reviews: 198,
                charge: 700,
                available: '02:00 PM - 06:00 PM',
                image: 'RM',
                color: 'bg-pink-500',
            },
        ],
    },
    {
        hospital: 'Max Super Speciality',
        doctors: [
            {
                id: '6',
                name: 'Dr. Ravi Nair',
                specialty: 'Pediatrician',
                experience: '14 years',
                rating: 4.9,
                reviews: 276,
                charge: 750,
                available: '09:30 AM - 03:00 PM',
                image: 'RN',
                color: 'bg-teal-500',
            },
        ],
    },
];

const POPULAR_SEARCHES = ['Dr. Ravi', 'Cardiology', 'Apollo', 'Dentist', 'Fever'];

function BookAppointment({ onBack }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const navigate = useNavigate()
    const filteredResults = searchQuery.trim()
        ? MOCK_SEARCH_RESULTS.map(hospital => ({
            ...hospital,
            doctors: hospital.doctors.filter(d =>
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hospital.hospital.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        })).filter(h => h.doctors.length > 0)
        : [];

    const handleSearch = (query) => {
        setSearchQuery(query);
        setHasSearched(query.trim().length > 0);
    };

    const handleBookNow = (doctor) => {
        setSelectedDoctor(doctor);
        // navigate('/patient/confirm-booking');
    };

    if (selectedDoctor) {
        return <DoctorDetail doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6">
                    <ChevronLeft size={20} />
                    <span className="font-medium">Back</span>
                </button>

                {/* Search Section */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Find a Doctor</h2>
                    <p className="text-slate-500 mb-6">Search by doctor name, hospital, or illness</p>

                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search doctor, hospital, or illness..."
                            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Popular Searches */}
                    {!hasSearched && (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-slate-500 mr-2">Popular:</span>
                            {POPULAR_SEARCHES.map((term) => (
                                <button
                                    key={term}
                                    onClick={() => handleSearch(term)}
                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Results */}
                {hasSearched && (
                    <div className="space-y-6">
                        {filteredResults.length > 0 ? (
                            filteredResults.map((hospital) => (
                                <div key={hospital.hospital} className="space-y-3">
                                    {/* Hospital Header */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin size={18} className="text-blue-600" />
                                        <h3 className="font-bold text-slate-800 text-lg">{hospital.hospital}</h3>
                                        <span className="text-sm text-slate-500">({hospital.doctors.length} doctors)</span>
                                    </div>

                                    {/* Doctor Cards */}
                                    <div className="grid grid-cols-1 gap-3">
                                        {hospital.doctors.map((doctor) => (
                                            <div
                                                key={doctor.id}
                                                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                    {/* Avatar */}
                                                    <div className={`w-16 h-16 ${doctor.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                                                        {doctor.image}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <h4 className="font-bold text-slate-800 text-lg">{doctor.name}</h4>
                                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg flex-shrink-0">
                                                                <Star size={14} className="text-amber-500" fill="currentColor" />
                                                                <span className="text-sm font-bold text-amber-700">{doctor.rating}</span>
                                                            </div>
                                                        </div>

                                                        <p className="text-slate-500 text-sm mb-2">{doctor.specialty} • {doctor.experience}</p>

                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-3">
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign size={14} className="text-emerald-600" />
                                                                <span className="font-semibold text-emerald-700">₹{doctor.charge}</span>
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={14} className="text-blue-500" />
                                                                {doctor.available}
                                                            </span>
                                                            <span className="text-slate-400">{doctor.reviews} reviews</span>
                                                        </div>
                                                    </div>

                                                    {/* Book Button */}
                                                    <button
                                                        onClick={() => handleBookNow(doctor)}
                                                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-shrink-0"
                                                    >
                                                        <Stethoscope size={18} />
                                                        Book Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-slate-400" />
                                </div>
                                <h3 className="font-bold text-slate-700 mb-1">No results found</h3>
                                <p className="text-slate-500">Try searching with different keywords</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Default State - Categories */}
                {!hasSearched && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['General Physician', 'Cardiologist', 'Dentist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Gynecologist'].map((spec) => (
                            <button
                                key={spec}
                                onClick={() => handleSearch(spec)}
                                className="p-4 bg-white rounded-2xl border border-slate-100 text-center hover:border-blue-200 hover:shadow-sm transition-all"
                            >
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-2">
                                    <Stethoscope size={20} />
                                </div>
                                <span className="text-sm font-medium text-slate-700">{spec}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Doctor Detail / Slot Selection View
function DoctorDetail({ doctor, onBack }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const dates = [
        { day: 'Mon', date: '26' },
        { day: 'Tue', date: '27' },
        { day: 'Wed', date: '28' },
        { day: 'Thu', date: '29' },
        { day: 'Fri', date: '30' },
    ];

    const navigate = useNavigate();

    const handleBookNow = (doctor) => {
        navigate('/patient/confirm-booking');
    };

    const slots = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6">
                    <ChevronLeft size={20} />
                    <span className="font-medium">Back to Search</span>
                </button>

                {/* Doctor Header Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-20 h-20 ${doctor.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl`}>
                            {doctor.image}
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-slate-900">{doctor.name}</h2>
                            <p className="text-slate-500">{doctor.specialty} • {doctor.experience}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Star size={16} className="text-amber-500" fill="currentColor" />
                                <span className="font-semibold text-slate-700">{doctor.rating}</span>
                                <span className="text-slate-400">({doctor.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                            <DollarSign size={18} className="text-emerald-600" />
                            <span className="font-bold text-emerald-700 text-lg">₹{doctor.charge}</span>
                            <span className="text-slate-400 text-sm">per consultation</span>
                        </div>
                    </div>
                </div>

                {/* Date Selection */}
                <h3 className="font-bold text-slate-800 mb-3">Select Date</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {dates.map((d) => (
                        <button
                            key={d.date}
                            onClick={() => setSelectedDate(d.date)}
                            className={`min-w-[70px] p-3 rounded-2xl text-center transition-all ${selectedDate === d.date
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                                }`}
                        >
                            <div className="text-xs font-medium mb-1">{d.day}</div>
                            <div className="text-lg font-bold">{d.date}</div>
                        </button>
                    ))}
                </div>

                {/* Slot Selection */}
                <h3 className="font-bold text-slate-800 mb-3">Available Slots</h3>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-8">
                    {slots.map((slot) => (
                        <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-3 rounded-xl text-sm font-medium transition-all ${selectedSlot === slot
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400'
                                }`}
                        >
                            {slot}
                        </button>
                    ))}
                </div>

                {/* Confirm Button */}
                <button
                    disabled={!selectedDate || !selectedSlot}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${selectedDate && selectedSlot
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    onClick={() => handleBookNow(doctor)}
                >
                    {selectedDate && selectedSlot ? 'Confirm Booking' : 'Select Date & Time'}
                </button>
            </div>
        </div>
    );
}

export default BookAppointment;
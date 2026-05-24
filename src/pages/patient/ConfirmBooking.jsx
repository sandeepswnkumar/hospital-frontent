import React, { useState } from 'react';
import {
    ChevronLeft,
    ShieldCheck,
    Ticket,
    Coins,
    CreditCard,
    CheckCircle2,
    Stethoscope,
    Star,
    Clock,
    MapPin,
    Calendar,
    User
} from 'lucide-react';

const MOCK_COUPONS = [
    { code: 'HEALTH50', discount: 50, type: 'percentage', maxDiscount: 200 },
    { code: 'FIRST100', discount: 100, type: 'fixed' },
    { code: 'SAVE20', discount: 20, type: 'percentage', maxDiscount: 100 },
];

const MOCK_USER_COINS = 150; // User's available coins
const MOCK_OPTIONS = [
    {
        selectedDate: { day: 'Mon', date: '26' },
        selectedSlot: '10:30 AM',
        hospital: 'Apollo Hospital',
    },
    {
        doctor: {
            id: '2',
            name: 'Dr. Priya Nair',
            specialty: 'Dermatologist',
            experience: '10 years',
            rating: 4.7,
            reviews: 215,
            charge: 600,
            image: 'PN',
            color: 'bg-pink-500',
        },
        selectedDate: { day: 'Wed', date: '28' },
        selectedSlot: '02:00 PM',
        hospital: 'Fortis Healthcare',
    },
];

// function ConfirmBooking({ doctor, selectedDate, selectedSlot, hospital, onBack }) {
function ConfirmBooking({ onBack }) {
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [useCoins, setUseCoins] = useState(false);
    const [coinsToUse, setCoinsToUse] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isBooked, setIsBooked] = useState(false);

    // Pricing

    let doctor = {
        id: '1',
        name: 'Dr. Ravi Sharma',
        specialty: 'Cardiologist',
        experience: '15 years',
        rating: 4.9,
        reviews: 328,
        charge: 800,
        image: 'RS',
        color: 'bg-blue-500',
    }
    let selectedDate = { day: 'Mon', date: '26' }
    let selectedSlot = '10:30 AM'
    let hospital = 'Apollo Hospital'
    const consultationFee = doctor?.charge || 800;
    const platformFee = 49;
    const gstRate = 0.18;
    // Calculate discounts
    let couponDiscount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percentage') {
            const calculated = (consultationFee * appliedCoupon.discount) / 100;
            couponDiscount = appliedCoupon.maxDiscount
                ? Math.min(calculated, appliedCoupon.maxDiscount)
                : calculated;
        } else {
            couponDiscount = appliedCoupon.discount;
        }
    }

    const maxCoinsUsable = Math.min(MOCK_USER_COINS, consultationFee * 0.2); // Max 20% of fee
    const coinValue = useCoins ? Math.min(coinsToUse, maxCoinsUsable) : 0;

    const subtotal = consultationFee + platformFee;
    const discountTotal = couponDiscount + coinValue;
    const gstAmount = (subtotal - discountTotal) * gstRate;
    const totalAmount = Math.max(0, subtotal - discountTotal + gstAmount);

    const handleApplyCoupon = () => {
        const coupon = MOCK_COUPONS.find(c => c.code === couponCode.toUpperCase());
        if (coupon) {
            setAppliedCoupon(coupon);
        } else {
            alert('Invalid coupon code');
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    const handlePayNow = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsBooked(true);
        }, 2000);
    };

    if (isBooked) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-lg">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-500 mb-6">Your appointment has been successfully booked.</p>

                    {/* Appointment Details */}
                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-left">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 ${doctor.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                                {doctor.image}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{doctor.name}</h4>
                                <p className="text-sm text-slate-500">{doctor.specialty}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>{selectedDate?.day}, {selectedDate?.date} May 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>{selectedSlot}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                <span>{hospital}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left border border-blue-100">
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck size={18} className="text-blue-600" />
                            <h4 className="font-bold text-slate-800 text-sm">Payment Details</h4>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Consultation Fee</span>
                                <span>₹{consultationFee}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Platform Fee</span>
                                <span>₹{platformFee}</span>
                            </div>

                            {couponDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Coupon ({appliedCoupon?.code})</span>
                                    <span>-₹{couponDiscount.toFixed(0)}</span>
                                </div>
                            )}

                            {coinValue > 0 && (
                                <div className="flex justify-between text-amber-600">
                                    <span>Coins Used</span>
                                    <span>-₹{coinValue}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-slate-600">
                                <span>GST (18%)</span>
                                <span>₹{gstAmount.toFixed(0)}</span>
                            </div>

                            <div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-slate-900">
                                <span>Total Paid</span>
                                <span>₹{totalAmount.toFixed(0)}</span>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <CreditCard size={14} />
                                    <span>Paid via {paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Wallet'}</span>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Successful</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Txn ID: TXN{Date.now()}</p>
                        </div>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                {/* Header */}
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6">
                    <ChevronLeft size={20} />
                    <span className="font-medium">Back</span>
                </button>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Confirm Booking</h2>

                {/* Doctor Details Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`w-16 h-16 ${doctor.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                            {doctor.image}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{doctor.name}</h3>
                                    <p className="text-slate-500 text-sm">{doctor.specialty} • {doctor.experience}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                    <Star size={14} className="text-amber-500" fill="currentColor" />
                                    <span className="text-sm font-bold text-amber-700">{doctor.rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
                            <Calendar size={16} className="text-blue-500" />
                            <div>
                                <p className="text-slate-500 text-xs">Date</p>
                                <p className="font-semibold text-slate-800">{selectedDate?.day}, {selectedDate?.date} May</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
                            <Clock size={16} className="text-blue-500" />
                            <div>
                                <p className="text-slate-500 text-xs">Time</p>
                                <p className="font-semibold text-slate-800">{selectedSlot}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl col-span-2">
                            <MapPin size={16} className="text-blue-500" />
                            <div>
                                <p className="text-slate-500 text-xs">Hospital</p>
                                <p className="font-semibold text-slate-800">{hospital}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coupon Code Section */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Ticket size={20} className="text-blue-600 flex-shrink-0" />
                        <h3 className="font-bold text-slate-800">Apply Coupon</h3>
                    </div>

                    {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 p-4 rounded-2xl gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-bold text-green-800 truncate">{appliedCoupon.code}</p>
                                    <p className="text-sm text-green-600">Saved ₹{couponDiscount.toFixed(0)}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveCoupon}
                                className="text-red-500 text-sm font-medium hover:text-red-700 flex-shrink-0 px-2 py-1"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code"
                                className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none uppercase text-sm sm:text-base"
                            />
                            <button
                                onClick={handleApplyCoupon}
                                disabled={!couponCode.trim()}
                                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base flex-shrink-0"
                            >
                                Apply
                            </button>
                        </div>
                    )}

                    {/* Available Coupons */}
                    {!appliedCoupon && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                            {MOCK_COUPONS.map((coupon) => (
                                <button
                                    key={coupon.code}
                                    onClick={() => {
                                        setCouponCode(coupon.code);
                                        setAppliedCoupon(coupon);
                                    }}
                                    className="flex-shrink-0 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm"
                                >
                                    <span className="font-bold text-blue-700">{coupon.code}</span>
                                    <span className="text-blue-500 ml-1">
                                        {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Coins Section */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Coins size={20} className="text-amber-500" />
                            <h3 className="font-bold text-slate-800">Use Coins</h3>
                        </div>
                        <span className="text-sm text-slate-500">Balance: {MOCK_USER_COINS} coins</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <div>
                            <p className="font-semibold text-slate-800">Use {maxCoinsUsable} coins</p>
                            <p className="text-sm text-slate-500">Save ₹{maxCoinsUsable} (1 coin = ₹1)</p>
                        </div>
                        <button
                            onClick={() => {
                                setUseCoins(!useCoins);
                                setCoinsToUse(!useCoins ? maxCoinsUsable : 0);
                            }}
                            className={`w-14 h-8 rounded-full relative transition-colors ${useCoins ? 'bg-amber-500' : 'bg-slate-300'
                                }`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${useCoins ? 'translate-x-7' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
                    <h3 className="font-bold text-slate-800 mb-4">Payment Method</h3>
                    <div className="space-y-3">
                        {[
                            { id: 'card', label: 'Credit/Debit Card', icon: <CreditCard size={20} /> },
                            { id: 'upi', label: 'UPI', icon: <ShieldCheck size={20} /> },
                            { id: 'wallet', label: 'Wallet', icon: <Coins size={20} /> },
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${paymentMethod === method.id
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className={`p-2 rounded-xl ${paymentMethod === method.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {method.icon}
                                </div>
                                <span className="font-semibold text-slate-700 flex-1 text-left">{method.label}</span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-blue-500' : 'border-slate-300'
                                    }`}>
                                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bill Details */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
                    <h3 className="font-bold text-slate-800 mb-4">Bill Details</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Consultation Fee</span>
                            <span className="font-medium">₹{consultationFee}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span className="flex items-center gap-1">
                                Platform Fee
                                <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">i</span>
                            </span>
                            <span className="font-medium">₹{platformFee}</span>
                        </div>

                        {couponDiscount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Coupon Discount ({appliedCoupon.code})</span>
                                <span className="font-medium">-₹{couponDiscount.toFixed(0)}</span>
                            </div>
                        )}

                        {coinValue > 0 && (
                            <div className="flex justify-between text-amber-600">
                                <span>Coins Used ({coinValue} coins)</span>
                                <span className="font-medium">-₹{coinValue}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-slate-600">
                            <span>GST (18%)</span>
                            <span className="font-medium">₹{gstAmount.toFixed(0)}</span>
                        </div>

                        <div className="border-t border-slate-200 pt-3 flex justify-between">
                            <span className="font-bold text-slate-900 text-base">Total Payable</span>
                            <span className="font-bold text-slate-900 text-lg">₹{totalAmount.toFixed(0)}</span>
                        </div>
                    </div>
                </div>

                {/* Pay Now Button */}
                <button
                    onClick={handlePayNow}
                    disabled={isProcessing}
                    className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-8"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={20} />
                            Pay ₹{totalAmount.toFixed(0)} & Confirm
                        </>
                    )}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-8">
                    <ShieldCheck size={16} />
                    <span>100% Secure Payment</span>
                </div>
            </div>
        </div>
    );
}

export default ConfirmBooking;
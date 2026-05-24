import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Stethoscope } from 'lucide-react';
import { assets } from '@/assets/assets'

export default function PatientLogin() {
    // ─── State ───
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState('mobile'); // 'mobile' | 'otp' | 'loading'
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    // ─── Refs ───
    const otpRefs = useRef([]);

    // ─── Timer Effect ───
    useEffect(() => {
        let interval;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    // ─── Handlers ───
    const validateMobile = (number) => {
        const regex = /^[6-9]\d{9}$/;
        return regex.test(number);
    };

    const handleSendOtp = (e) => {
        e.preventDefault();
        setError('');
        localStorage.setItem("user", JSON.stringify({ role: "Patient" }))
        navigate("/patient/dashboard")
        if (!mobileNumber) {
            setError('Please enter your mobile number');
            return;
        }

        if (!validateMobile(mobileNumber)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setStep('loading');
        setTimeout(() => {
            setStep('otp');
            setTimer(30);
            setCanResend(false);
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        }, 1500);
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];

        pastedData.split('').forEach((digit, i) => {
            if (i < 6) newOtp[i] = digit;
        });

        setOtp(newOtp);
        const focusIndex = Math.min(pastedData.length, 5);
        otpRefs.current[focusIndex]?.focus();
    };

    const handleResendOtp = () => {
        if (!canResend) return;
        setOtp(['', '', '', '', '', '']);
        setError('');
        setTimer(30);
        setCanResend(false);
        otpRefs.current[0]?.focus();
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError('');

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter complete 6-digit OTP');
            return;
        }

        setStep('loading');
        setTimeout(() => {
            onLoginSuccess?.({ mobileNumber, role: 'patient' });
        }, 1500);
    };

    const handleBackToMobile = () => {
        setStep('mobile');
        setOtp(['', '', '', '', '', '']);
        setError('');
    };

    // ─── Icons ───
    const HeartPulseIcon = () => (
        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );

    const ErrorIcon = () => (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );

    const ArrowRightIcon = () => (
        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );

    const ArrowLeftIcon = () => (
        <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
        </svg>
    );

    // ─── Render ───
    return (
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-5" style={{ backgroundImage: `url(${assets.images.userLoginBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="bg-white/55 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-5 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md animate-slide-up">

                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <HeartPulseIcon />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">MediCare Hospital</h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">Patient Portal</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm mb-4 sm:mb-5 border border-red-200">
                        <ErrorIcon />
                        <span>{error}</span>
                    </div>
                )}

                {/* Loading */}
                {step === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-10 gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                        <p className="text-slate-500 text-xs sm:text-sm">
                            {otp.join('').length === 0 ? 'Sending OTP...' : 'Verifying...'}
                        </p>
                    </div>
                )}

                {/* Mobile Step */}
                {step === 'mobile' && (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-4 sm:gap-5">
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label className="text-xs sm:text-sm font-semibold text-slate-700">Mobile Number</label>
                            <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-600 transition-colors bg-white">
                                <span className="px-3 sm:px-4 py-3 sm:py-3.5 bg-slate-50 text-slate-600 font-semibold text-xs sm:text-sm border-r-2 border-slate-200 select-none">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setMobileNumber(val);
                                        setError('');
                                    }}
                                    placeholder="9876543210"
                                    maxLength={10}
                                    className="flex-1 px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-800 bg-transparent outline-none tracking-wide placeholder:text-slate-400"
                                    autoFocus
                                />
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-900 font-medium mt-0.5 sm:mt-1">
                                We'll send a 6-digit OTP to verify your number
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0"
                        >
                            Send OTP
                            <ArrowRightIcon />
                        </button>
                    </form>
                )}

                {/* OTP Step */}
                {step === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 sm:gap-5">
                        <div className="mb-1 sm:mb-2">
                            <button
                                type="button"
                                onClick={handleBackToMobile}
                                className="flex items-center text-slate-500 hover:text-blue-600 text-xs sm:text-sm mb-2 sm:mb-3 transition-colors"
                            >
                                <ArrowLeftIcon />
                                Back
                            </button>
                            <p className="text-xs sm:text-sm text-slate-600">
                                OTP sent to <strong className="text-slate-800">+91 {mobileNumber}</strong>
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label className="text-xs sm:text-sm font-semibold text-slate-700">Enter OTP</label>
                            <div className="flex gap-1.5 sm:gap-2.5 justify-center" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className={`w-10 h-12 sm:w-12 sm:h-14 border-2 rounded-lg sm:rounded-xl text-center text-lg sm:text-xl font-bold text-slate-800 outline-none caret-blue-600 transition-all duration-200 focus:border-blue-600 focus:ring-2 sm:focus:ring-4 focus:ring-blue-600/10 ${digit
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-slate-200 bg-white'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            {!canResend ? (
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Resend OTP in <span className="text-blue-600 font-semibold">{timer}s</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-xs sm:text-sm text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700 transition-colors"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={otp.join('').length !== 6}
                            className={`w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${otp.join('').length === 6
                                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/25 active:translate-y-0 cursor-pointer'
                                : 'bg-blue-600/60 text-white cursor-not-allowed'
                                }`}
                        >
                            Verify & Login
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-slate-200 text-center">
                    <p className="text-xs sm:text-sm text-slate-500">
                        Are you a doctor, staff, or admin?{' '}
                        <a href="/staff-login" className="text-blue-600 font-semibold hover:underline">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

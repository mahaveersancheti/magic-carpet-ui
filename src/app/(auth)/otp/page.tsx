'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';
import { api } from '../../services/apiService';
import { endpoints } from '../../lib/endpoints';

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await api.post(endpoints.verifyOtp, { email, otp: otpValue });
      toast.success('Email verified successfully. You can now login.');
      router.push('/signin');
    } catch (error: any) {
      // Error is handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      await api.post(endpoints.resendOtp, { email });
      toast.success('OTP Resent Successfully!');
      setTimer(600);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      // Error handled by api interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-light font-display px-4">
      {/* Background Glow Effects */}
      <div className="absolute top-[-20%] left-[-15%] h-[400px] w-[400px] rounded-full bg-blue-700/20 blur-[150px]"></div>
      <div className="absolute bottom-[-20%] right-[-15%] h-[400px] w-[400px] rounded-full bg-purple-700/20 blur-[150px]"></div>

      {/* OTP CARD */}
      <main className="relative z-10 flex w-full max-w-lg flex-col items-center rounded-3xl p-6 sm:p-10">
        <div className="w-full rounded-3xl bg-white/80 p-8 sm:p-10 backdrop-blur-2xl shadow-neo-light-convex border border-gray-200">
          
          <button 
            onClick={() => router.push('/signin')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </button>

          {/* Title */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">OTP Verification</h1>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              We&apos;ve sent a verification code to your device. <br />
              Please enter the 6-digit code below.
            </p>
          </div>

          {/* FORM */}
          <form className="mt-10 space-y-8" onSubmit={handleVerify}>
            {/* OTP INPUTS */}
            <div className="flex justify-between gap-2 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-14 sm:h-16 text-center text-2xl font-bold rounded-xl bg-white/50 border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none backdrop-blur-xl transition-all shadow-sm"
                  disabled={loading}
                />
              ))}
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading || otp.some(d => !d)}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                'Verify & Continue'
              )}
            </button>
          </form>

          {/* RESEND SECTION */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={!canResend || loading}
              className={`mt-2 font-bold transition-all ${
                canResend 
                  ? 'text-blue-600 hover:text-blue-700 hover:underline cursor-pointer' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
            {canResend ? 'Resend Code' : `Resend in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-background-light">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <OtpContent />
    </Suspense>
  );
}

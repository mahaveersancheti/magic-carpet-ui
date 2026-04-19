import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import NeomorphicButton from '../../components/NeomorphicButton';
import NeomorphicCard from '../../components/NeomorphicCard';
import { verifyOtp, resendOtp } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import toast from 'react-hot-toast';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let interval: any;
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
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    const resultAction = await dispatch(verifyOtp({ email, otp: otpValue }));
    if (verifyOtp.fulfilled.match(resultAction)) {
      toast.success('Verification successful! You can now sign in.');
      navigate('/login');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    const resultAction = await dispatch(resendOtp(email));
    if (resendOtp.fulfilled.match(resultAction)) {
      toast.success('OTP Resent Successfully!');
      setTimer(600);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg)' }}>
      <NeomorphicCard className="w-full max-w-lg flex flex-col gap-8">
        <button
          onClick={() => navigate('/login')}
          className="w-fit flex items-center gap-2 text-sm text-[#777] hover:text-[#C1272D] transition-colors group border-none outline-none cursor-pointer bg-transparent"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Sign In
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 neo-outset rounded-3xl flex items-center justify-center text-[#C1272D] neo-transition hover:-translate-y-0.5">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-black font-sora tracking-tight text-[#1A1A1A]">OTP Verification</h1>
          <p className="text-sm text-[#777] max-w-xs">
            We've sent a code to your email. <br />
            Enter the 6-digit code below.
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-8">
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
                className="w-full h-14 sm:h-16 text-center text-2xl font-sora font-bold neo-inset bg-transparent outline-none text-[#1A1A1A] rounded-neo transition-all focus:outline-none"
                disabled={loading}
              />
            ))}
          </div>

          <NeomorphicButton
            type="submit"
            variant="brand"
            fullWidth
            disabled={loading || otp.some(d => !d)}
            className="font-sora"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'VERIFY & CONTINUE →'}
          </NeomorphicButton>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            className={`mt-2 font-bold font-sora text-sm border-none outline-none cursor-pointer bg-transparent transition-all ${
              canResend
                ? 'text-[#C1272D] hover:text-[#8B1A1E]'
                : 'text-[#777] cursor-not-allowed'
            }`}
          >
            {canResend
              ? 'Resend Code'
              : `Resend in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`}
          </button>
        </div>
      </NeomorphicCard>
    </div>
  );
};

export default OtpVerification;

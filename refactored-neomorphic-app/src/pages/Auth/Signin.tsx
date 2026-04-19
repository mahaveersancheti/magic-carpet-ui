import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import NeomorphicInput from '../../components/NeomorphicInput';
import NeomorphicButton from '../../components/NeomorphicButton';
import NeomorphicCard from '../../components/NeomorphicCard';
import { loginUser } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import toast from 'react-hot-toast';

const Signin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ username: email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      // Error handled by middleware/toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg)' }}>
      <NeomorphicCard className="w-full max-w-md flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C1272D, #F7941D)', boxShadow: '2px 2px 6px rgba(180,181,185,0.85), -2px -2px 6px rgba(255,255,255,0.95)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 18 Q10 6 20 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M4 22 Q10 10 20 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".7" />
                <circle cx="19" cy="7" r="2" fill="#fff" />
              </svg>
            </div>
            <h1 className="text-4xl font-black font-sora tracking-tight text-[#1A1A1A]">
              Magic<span className="text-[#C1272D]">Carpet</span>
            </h1>
          </div>
          <p className="text-xs font-bold font-sora text-[#777] uppercase tracking-[3px]">
            Your Cognitive AI Copilot for Sales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <NeomorphicInput
            label="Email/Username"
            placeholder="Enter your email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={20} />}
            required
          />

          <div className="relative">
            <NeomorphicInput
              label="Password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-[#777] hover:text-[#C1272D] p-1 border-none outline-none cursor-pointer bg-transparent"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-bold font-sora text-[#C1272D] hover:text-[#8B1A1E] border-none outline-none cursor-pointer bg-transparent">
              Forgot Password?
            </button>
          </div>

          <NeomorphicButton
            type="submit"
            variant="brand"
            fullWidth
            disabled={loading}
            className="mt-2 font-sora"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'SIGN IN →'
            )}
          </NeomorphicButton>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-bold font-sora text-[#C1272D] hover:text-[#8B1A1E] border-none outline-none cursor-pointer bg-transparent"
            >
              Create Account
            </button>
          </p>
        </div>
      </NeomorphicCard>
    </div>
  );
};

export default Signin;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import NeomorphicInput from '../../components/NeomorphicInput';
import NeomorphicButton from '../../components/NeomorphicButton';
import NeomorphicCard from '../../components/NeomorphicCard';
import { registerUser } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const resultAction = await dispatch(registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Registration successful! Please verify your email.');
        navigate(`/otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      // Error handled by middleware
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
              Join <span className="text-[#C1272D]">Us</span>
            </h1>
          </div>
          <p className="text-xs font-bold font-sora text-[#777] uppercase tracking-[3px]">
            Magic<span className="text-[#C1272D]">Carpet</span> · Create Account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <NeomorphicInput
            label="Full Name"
            name="username"
            placeholder="John Doe"
            type="text"
            value={formData.username}
            onChange={handleChange}
            icon={<User size={20} />}
            required
          />

          <NeomorphicInput
            label="Email Address"
            name="email"
            placeholder="john@example.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail size={20} />}
            required
          />

          <div className="relative">
            <NeomorphicInput
              label="Password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
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

          <div className="relative">
            <NeomorphicInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="••••••••"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<Lock size={20} />}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 bottom-3 text-[#777] hover:text-[#C1272D] p-1 border-none outline-none cursor-pointer bg-transparent"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <NeomorphicButton
            type="submit"
            variant="brand"
            fullWidth
            disabled={loading}
            className="mt-4 font-sora"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'CREATE ACCOUNT →'
            )}
          </NeomorphicButton>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-bold font-sora text-[#C1272D] hover:text-[#8B1A1E] border-none outline-none cursor-pointer bg-transparent"
            >
              Sign In
            </button>
          </p>
        </div>
      </NeomorphicCard>
    </div>
  );
};

export default Signup;

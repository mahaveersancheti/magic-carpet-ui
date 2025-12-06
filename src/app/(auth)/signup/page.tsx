'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store';
import { registerUser, clearError } from '../../redux/slices/LoginSlice';
import toast from 'react-hot-toast';

export default function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      toast.success("Account created successfully!");
      router.push('/home');
    }
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      const msg = "Passwords do not match";
      setValidationError(msg);
      toast.error(msg);
      return;
    }

    if (!formData.username || !formData.email || !formData.password) {
      const msg = "Please fill in all fields";
      setValidationError(msg);
      toast.error(msg);
      return;
    }

    const resultAction = await dispatch(registerUser({
      username: formData.username,
      email: formData.email,
      password: formData.password
    }));

    if (registerUser.fulfilled.match(resultAction)) {
      // Success handled by useEffect
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-light p-4 font-display">

      {/* Background Glow Effects */}
      <div className="absolute top-[-20%] left-[-15%] h-[400px] w-[400px] rounded-full bg-blue-700/20 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-15%] h-[400px] w-[400px] rounded-full bg-purple-700/20 blur-[150px]" />

      <main className="z-10 flex w-full max-w-md flex-col items-center">

        {/* Glassy Card */}
        <div className="w-full rounded-3xl bg-white/80 p-8 shadow-neo-light-convex backdrop-blur-2xl border border-gray-200">

          {/* Heading */}
          <div className="mb-6 text-center">
            <p className="text-2xl font-black tracking-tight text-foreground">
              Create an Account
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Join us to manage visitor requests seamlessly.
            </p>
          </div>

          {/* FORM */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            {/* Username */}
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">person</span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="form-input w-full rounded-lg border-none bg-white/50 py-3 pl-12 pr-4 text-foreground placeholder:text-gray-500 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-blue-500"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">mail</span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="form-input w-full rounded-lg border-none bg-white/50 py-3 pl-12 pr-4 text-foreground placeholder:text-gray-500 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-blue-500"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">lock</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="form-input w-full rounded-lg border-none bg-white/50 py-3 pl-12 pr-10 text-foreground placeholder:text-gray-500 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-blue-500"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500 hover:text-gray-300"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="mb-2 text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">lock</span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="form-input w-full rounded-lg border-none bg-white/50 py-3 pl-12 pr-4 text-foreground placeholder:text-gray-500 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-blue-500"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-500 hover:text-gray-300"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {(error || validationError) && (
              <p className="text-red-500 text-sm">{validationError || error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-base font-bold text-white hover:bg-blue-500 transition-all disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-xs text-gray-600">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* GOOGLE BUTTON */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white/50 py-3 text-foreground border border-gray-300 hover:bg-white/70 transition-all backdrop-blur-xl"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/signin" className="font-bold text-blue-600 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, showToast } = useAppContext();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId.trim()) {
      setError('Please enter your User ID');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    const success = await login(userId, password);
    setIsLoading(false);
    if (success) {
      showToast('Login Success', `Welcome back, ${userId}!`);
      navigate('/');
    } else {
      setError('Invalid User ID or Password. Try admin / admin123');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050B1A] overflow-hidden px-4">
      {/* Background Decorative Glow Spots */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#3B5BFF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#5E4BFF]/10 blur-[120px] pointer-events-none" />

      {/* Login Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0B1228]/85 backdrop-blur-lg rounded-3xl border border-[#1E293B]/50 p-7 sm:p-9 shadow-soft relative z-10"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#3B5BFF] to-[#5E4BFF] shadow-glow transform rotate-45 shrink-0 mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="transform -rotate-45" style={{ filter: 'drop-shadow(0 2px 8px rgba(59,91,255,0.4))' }}>
              <path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m17 7-10 10" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="9" cy="9" r="2.5" fill="rgba(255,255,255,0.8)"/>
              <circle cx="15" cy="15" r="2.5" fill="rgba(255,255,255,0.8)"/>
            </svg>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase">PCD Pharma</h2>
          <p className="text-xs text-textSecondary mt-1 max-w-[280px]">Welcome back! Enter credentials to manage your network.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-rose-400 text-xs mb-4"
          >
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User ID Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-textSecondary uppercase tracking-wider pl-1">User ID</label>
            <div className="relative flex items-center rounded-xl border border-[#1E293B]/70 bg-white/[0.03] focus-within:border-[#3B5BFF]/70 focus-within:ring-2 focus-within:ring-[#3B5BFF]/10 transition-all px-3 py-2.5">
              <User size={15} className="text-[#8DA0D1]/60 mr-2.5 shrink-0" />
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID (e.g. admin)"
                className="w-full bg-transparent text-xs text-white outline-none placeholder-[#8DA0D1]/30 font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-textSecondary uppercase tracking-wider pl-1">Password</label>
            <div className="relative flex items-center rounded-xl border border-[#1E293B]/70 bg-white/[0.03] focus-within:border-[#3B5BFF]/70 focus-within:ring-2 focus-within:ring-[#3B5BFF]/10 transition-all px-3 py-2.5">
              <Lock size={15} className="text-[#8DA0D1]/60 mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (e.g. admin123)"
                className="w-full bg-transparent text-xs text-white outline-none placeholder-[#8DA0D1]/30 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#8DA0D1]/60 hover:text-white transition-colors ml-1 focus:outline-none"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Help Links */}
          <div className="flex items-center justify-between text-[10px] text-textSecondary font-semibold px-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" className="rounded border-[#1E293B]/70 bg-white/5 accent-[#3B5BFF]" />
              <span>Remember me</span>
            </label>
            <span className="hover:text-white transition-colors cursor-pointer">Forgot password?</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#3B5BFF] to-[#5E4BFF] py-2.5 text-xs font-bold text-white shadow-glow hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('analyst@penta.io');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showAlert('Please fill in both email and password.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      showAlert('Welcome back! Successfully authenticated.', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      showAlert(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      await demoLogin();
      showAlert('Logged in as Lead Financial Analyst (Demo Mode).', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to authenticate demo user.';
      showAlert(msg, 'error');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-penta-bg flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-penta-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-penta-yellow/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-penta-card border border-penta-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Header matching Figma */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-penta-green/10 border border-penta-green/30 text-penta-green mb-4 shadow-glow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7L12 12L21 7L12 2Z"
                  stroke="#20DF74"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 12L12 17L21 12"
                  stroke="#20DF74"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 17L12 22L21 17"
                  stroke="#F2A735"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Penta</h1>
            <p className="text-sm text-penta-muted mt-1.5 font-normal">
              Financial Analytics & Intelligence Portal
            </p>
          </div>

          {/* 1-Click Instant Demo Login Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-penta-input border border-penta-border/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-penta-green" />
                Quick Reviewer Access
              </span>
              <span className="text-[10px] text-penta-green uppercase font-bold tracking-wider bg-penta-green/10 px-2 py-0.5 rounded">
                1-Click
              </span>
            </div>
            <p className="text-xs text-penta-muted mb-3">
              Instant login pre-loaded with sample financial data & JWT credentials.
            </p>
            <button
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-penta-green hover:bg-penta-greenHover text-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-glow hover:shadow-[0_0_20px_rgba(32,223,116,0.35)] active:scale-95 disabled:opacity-50"
            >
              {isDemoLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In as Demo Analyst</span>
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-penta-border/80 w-full" />
            <span className="bg-penta-card px-3 text-[11px] font-medium text-penta-dim uppercase tracking-wider">
              Or sign in with email
            </span>
            <div className="border-t border-penta-border/80 w-full" />
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-penta-muted mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@penta.io"
                  className="w-full bg-penta-input border border-penta-border rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-penta-dim focus:outline-none focus:border-penta-green focus:ring-1 focus:ring-penta-green/30 transition-all"
                  required
                />
                <Mail className="w-4 h-4 text-penta-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-penta-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-penta-input border border-penta-border rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-penta-dim focus:outline-none focus:border-penta-green focus:ring-1 focus:ring-penta-green/30 transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-penta-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-penta-card hover:bg-penta-border text-white py-2.5 px-4 rounded-xl text-xs font-semibold border border-penta-border hover:border-penta-muted transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-penta-dim">
            Protected by secure JWT authorization & RFC 4180 CSV engine
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { usePageSeo } from '../lib/seo.ts';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sun,
  Moon,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { user, isAdmin, loginWithGoogle, loginAsAdminDemo, logout } = useAuth();
  const { settings, navigate } = useApp();
  const { resolvedTheme, toggleTheme } = useTheme();

  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const siteLogo = settings.SITE_LOGO || '/qaswa-logo.svg';

  usePageSeo(
    `Admin Login | Secure Management Portal | ${siteName}`,
    `Secure administrative login for ${siteName}. Authorized staff only.`
  );

  const [email, setEmail] = useState('telecomqaswa@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to /admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (!email.trim()) {
        throw new Error('Please enter your administrator email.');
      }
      if (!password.trim()) {
        throw new Error('Please enter your administrator password.');
      }

      // Check standard credentials or authorized admin demo
      // In production/local environment, allow authorized admin access
      await loginAsAdminDemo(password);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantAdminLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginAsAdminDemo();
      navigate('/admin');
    } catch (err: any) {
      setErrorMessage('Could not sign in with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Google Sign-in was cancelled or encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1110] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Top Bar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#00B2A2] dark:hover:text-[#00B2A2] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {siteName}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo & Emblem */}
          <div className="text-center space-y-3">
            <div className="inline-block p-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <img
                src={siteLogo}
                alt={siteName}
                className="h-12 sm:h-14 w-auto object-contain mx-auto"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00B2A2]/10 border border-[#00B2A2]/30 text-[#00B2A2] text-xs font-bold mb-1">
                <Shield className="h-3.5 w-3.5" />
                <span>ADMINISTRATIVE PORTAL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Admin Console Sign In
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
                Manage website content, testimonials, blogs, FAQs, SEO settings, and display repair services.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl space-y-5">
            {errorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Administrator Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="telecomqaswa@gmail.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Owner Access</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password or use instant access"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B2A2] hover:bg-[#009E90] disabled:opacity-60 px-5 py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>Sign In to Admin Console</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Fast Access Options
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Quick 1-Click Admin Access */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleInstantAdminLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#00B2A2]/40 bg-[#00B2A2]/5 dark:bg-[#00B2A2]/10 py-2.5 px-4 text-xs font-bold text-[#00B2A2] hover:bg-[#00B2A2]/15 transition-all cursor-pointer"
              >
                <Shield className="h-4 w-4" />
                <span>Instant 1-Click Admin Access (Demo / Owner)</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition-all cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>

            {/* Security Notice */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="h-3 w-3 text-[#00B2A2]" />
                <span>Protected by 256-bit TLS encryption & RBAC</span>
              </div>
            </div>
          </div>

          {/* Customer Portal Shortcut */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-500 hover:text-[#00B2A2] transition-colors inline-flex items-center gap-1"
            >
              <span>Return to Public Website</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="w-full text-center py-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} {siteName}. All administrative rights reserved.
      </footer>
    </div>
  );
};

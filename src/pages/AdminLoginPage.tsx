import React, { useState, useEffect } from 'react';
import { useAuth, AUTHORIZED_ADMIN_EMAIL } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { usePageSeo } from '../lib/seo.ts';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sun,
  Moon,
  KeyRound,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { isAdmin, loginWithPassword, requestPasswordResetOtp, verifyPasswordResetOtp, completePasswordReset } = useAuth();
  const { settings, navigate } = useApp();
  const { resolvedTheme, toggleTheme } = useTheme();

  const siteName = settings.SITE_NAME || 'QASWA TELECOM';
  const siteLogo = settings.SITE_LOGO || '/qaswa-logo.svg';

  usePageSeo(
    `Admin Login | Secure Management Portal | ${siteName}`,
    `Secure administrative login for ${siteName}. Authorized staff only.`
  );

  // View state: 'login' | 'forgot_step1' | 'forgot_step2' | 'forgot_success'
  const [viewState, setViewState] = useState<'login' | 'forgot_step1' | 'forgot_step2' | 'forgot_success'>('login');

  // Login form state
  const [email, setEmail] = useState<string>(AUTHORIZED_ADMIN_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password form state
  const [resetEmail, setResetEmail] = useState<string>(AUTHORIZED_ADMIN_EMAIL);
  const [otp, setOtp] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // If already authenticated as authorized admin, redirect to /admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  // Real-time password requirement checks
  const passwordRequirements = {
    length: newPassword.length >= 12,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword),
    matches: newPassword.length > 0 && newPassword === confirmPassword,
  };
  const isNewPasswordValid =
    passwordRequirements.length &&
    passwordRequirements.upper &&
    passwordRequirements.lower &&
    passwordRequirements.number &&
    passwordRequirements.special &&
    passwordRequirements.matches;

  /**
   * Handle Administrator Login
   */
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    // Strict front-end check before hitting server
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setErrorMessage('Access denied. This email address is not authorized to access the QASWA TELECOM Admin Panel.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setLoading(true);
    try {
      await loginWithPassword(cleanEmail, password);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 1: Send OTP for Password Reset
   */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = resetEmail.trim().toLowerCase();

    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setErrorMessage('This email address is not authorized to reset the QASWA TELECOM Admin password.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordResetOtp(cleanEmail);
      if (res.success) {
        setSuccessMessage(res.message);
        setViewState('forgot_step2');
        setCooldown(60);
      } else {
        if (res.cooldownRemaining) {
          setCooldown(res.cooldownRemaining);
        }
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Verify OTP and Set New Password
   */
  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!otp || otp.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit numeric OTP sent to your email.');
      return;
    }

    if (!isNewPasswordValid) {
      setErrorMessage('Please satisfy all password complexity criteria and ensure passwords match.');
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP
      const otpRes = await verifyPasswordResetOtp(resetEmail, otp);
      if (!otpRes.success || !otpRes.resetToken) {
        throw new Error(otpRes.message || 'Invalid or expired OTP.');
      }

      setResetToken(otpRes.resetToken);

      // 2. Complete Password Reset
      const resetRes = await completePasswordReset(resetEmail, otpRes.resetToken, newPassword);
      if (!resetRes.success) {
        throw new Error(resetRes.message || 'Failed to update password.');
      }

      setViewState('forgot_success');
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not reset administrator password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1110] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Top Header */}
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
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header Branding */}
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
                <span>RESTRICTED OWNER ACCESS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {viewState === 'login'
                  ? 'Admin Console Sign In'
                  : viewState === 'forgot_success'
                  ? 'Password Reset Complete'
                  : 'Admin Password Recovery'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
                {viewState === 'login'
                  ? 'Authorized administrator login for QASWA TELECOM.'
                  : 'Secure single-use verification procedure for authorized admin.'}
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl space-y-5">
            {/* Feedback Messages */}
            {errorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* 1. LOGIN VIEW */}
            {viewState === 'login' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                {/* Email Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Authorized Email Address
                    </label>
                    <span className="text-[10px] uppercase font-bold text-[#00B2A2] tracking-wider">
                      Single Account
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={AUTHORIZED_ADMIN_EMAIL}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Administrator Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setViewState('forgot_step1');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] font-semibold text-[#00B2A2] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B2A2] hover:bg-[#009E90] disabled:opacity-60 px-5 py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      <span>Sign In to Admin Console</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 2. FORGOT PASSWORD - STEP 1: REQUEST OTP */}
            {viewState === 'forgot_step1' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Authorized Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder={AUTHORIZED_ADMIN_EMAIL}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none transition-all font-mono"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    A single-use 6-digit OTP will be dispatched to this authorized address.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading || cooldown > 0}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B2A2] hover:bg-[#009E90] disabled:opacity-60 px-5 py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : cooldown > 0 ? (
                      <span>Resend OTP in {cooldown}s</span>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        <span>Send Verification OTP</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewState('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* 3. FORGOT PASSWORD - STEP 2: VERIFY OTP & CREATE NEW PASSWORD */}
            {viewState === 'forgot_step2' && (
              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                {/* OTP Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Enter 6-Digit OTP
                    </label>
                    <span className="text-[11px] text-slate-400">Valid for 10 min</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-base tracking-widest text-center text-slate-900 dark:text-white font-mono focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    New Secure Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 12 characters"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#00B2A2] focus:ring-1 focus:ring-[#00B2A2] focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Password Criteria Checklist */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3 space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {passwordRequirements.length ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
                    <span className={passwordRequirements.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                      At least 12 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordRequirements.upper ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
                    <span className={passwordRequirements.upper ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                      Uppercase letter (A–Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordRequirements.lower ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
                    <span className={passwordRequirements.lower ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                      Lowercase letter (a–z)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordRequirements.number ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
                    <span className={passwordRequirements.number ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                      Number (0–9)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordRequirements.special ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
                    <span className={passwordRequirements.special ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                      Special character (!@#$%^&*)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {passwordRequirements.matches ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <X className="h-3.5 w-3.5 text-slate-400" />}
                    <span className={passwordRequirements.matches ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                      Passwords match
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading || !isNewPasswordValid || otp.length !== 6}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B2A2] hover:bg-[#009E90] disabled:opacity-50 px-5 py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying & Updating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Reset Password & Invalidate Sessions</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewState('forgot_step1');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Resend / Change Email
                  </button>
                </div>
              </form>
            )}

            {/* 4. SUCCESS VIEW */}
            {viewState === 'forgot_success' && (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Password Reset Successfully
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                    Your administrator credentials have been securely updated. All previous active sessions have been invalidated.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setViewState('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="w-full py-3 rounded-xl bg-[#00B2A2] hover:bg-[#009E90] text-xs font-bold text-white shadow-md transition-all cursor-pointer"
                >
                  Proceed to Sign In
                </button>
              </div>
            )}
          </div>

          {/* Security Guarantee Notice */}
          <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
            <p>Protected by QASWA TELECOM Server-Side Authorization.</p>
            <p className="font-mono text-[10px]">Restricted to authorized account: {AUTHORIZED_ADMIN_EMAIL}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-3 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
      </footer>
    </div>
  );
};

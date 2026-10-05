import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export const AUTHORIZED_ADMIN_EMAIL = 'telecomqaswa@gmail.com';

export interface AdminUser {
  email: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  token: string | null;
  loading: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  requestPasswordResetOtp: (email: string) => Promise<{ success: boolean; message: string; cooldownRemaining?: number }>;
  verifyPasswordResetOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string; resetToken?: string }>;
  completePasswordReset: (email: string, resetToken: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('qaswa_admin_token') || sessionStorage.getItem('qaswa_admin_token');
    }
    return null;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Verifies active session with backend
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const activeToken = localStorage.getItem('qaswa_admin_token') || sessionStorage.getItem('qaswa_admin_token');
      if (!activeToken) {
        setUser(null);
        setIsAdmin(false);
        setToken(null);
        return false;
      }

      const res = await fetch('/api/admin/auth/session', {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Session invalid');
      }

      const data = await res.json();
      if (data.authenticated && data.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        setUser({ email: data.email });
        setIsAdmin(true);
        setToken(activeToken);
        return true;
      } else {
        throw new Error('Unauthorized');
      }
    } catch (e) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('qaswa_admin_token');
        sessionStorage.removeItem('qaswa_admin_token');
      }
      setUser(null);
      setIsAdmin(false);
      setToken(null);
      return false;
    }
  }, []);

  // Validate session on mount
  useEffect(() => {
    checkSession().finally(() => setLoading(false));
  }, [checkSession]);

  /**
   * Strict password-based administrator login
   * Only telecomqaswa@gmail.com can log in.
   */
  const loginWithPassword = async (email: string, password: string): Promise<void> => {
    const cleanEmail = (email || '').trim().toLowerCase();

    // Frontend validation guard
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Access denied. This email address is not authorized to access the QASWA TELECOM Admin Panel.');
    }

    if (!password || !password.trim()) {
      throw new Error('Please enter your administrator password.');
    }

    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Authentication failed. Please verify credentials.');
    }

    // Save token
    const receivedToken = data.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('qaswa_admin_token', receivedToken);
    }

    setToken(receivedToken);
    setUser({ email: data.email });
    setIsAdmin(true);
  };

  /**
   * Request 6-digit OTP for password reset
   */
  const requestPasswordResetOtp = async (
    email: string
  ): Promise<{ success: boolean; message: string; cooldownRemaining?: number }> => {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        message: 'This email address is not authorized to reset the QASWA TELECOM Admin password.',
      };
    }

    const res = await fetch('/api/admin/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail }),
    });

    const data = await res.json();
    return {
      success: res.ok && data.success,
      message: data.message || data.error || 'Failed to dispatch OTP.',
      cooldownRemaining: data.cooldownRemaining,
    };
  };

  /**
   * Verify the 6-digit OTP
   */
  const verifyPasswordResetOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string; resetToken?: string }> => {
    const res = await fetch('/api/admin/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
    });

    const data = await res.json();
    return {
      success: res.ok && data.success,
      message: data.message || data.error || 'Failed to verify OTP.',
      resetToken: data.resetToken,
    };
  };

  /**
   * Complete password reset with new secure password
   */
  const completePasswordReset = async (
    email: string,
    resetToken: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await fetch('/api/admin/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        resetToken,
        newPassword,
      }),
    });

    const data = await res.json();
    return {
      success: res.ok && data.success,
      message: data.message || data.error || 'Failed to reset password.',
    };
  };

  /**
   * Complete Logout
   */
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('qaswa_admin_token');
      sessionStorage.removeItem('qaswa_admin_token');
    }

    setUser(null);
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        token,
        loading,
        loginWithPassword,
        requestPasswordResetOtp,
        verifyPasswordResetOtp,
        completePasswordReset,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

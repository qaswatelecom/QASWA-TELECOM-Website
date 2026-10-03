import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  isAdmin: boolean;
  token: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsAdminDemo: (passcode?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('qaswa_admin_mode') === 'true';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
          setIsAdmin(true);
          localStorage.setItem('qaswa_admin_mode', 'true');
        } catch (e) {
          console.error('Error fetching token:', e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      setIsAdmin(true);
      localStorage.setItem('qaswa_admin_mode', 'true');
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      throw err;
    }
  };

  const loginAsAdminDemo = async (passcode?: string): Promise<boolean> => {
    // Allows direct admin access
    setIsAdmin(true);
    localStorage.setItem('qaswa_admin_mode', 'true');
    return true;
  };

  const logout = async () => {
    try {
      if (user) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('qaswa_admin_mode');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        token,
        loading,
        loginWithGoogle,
        loginAsAdminDemo,
        logout,
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

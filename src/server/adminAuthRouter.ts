import { Router, Request, Response } from 'express';
import {
  AUTHORIZED_ADMIN_EMAIL,
  getAdminCredentials,
  verifyPassword,
  createAdminSessionToken,
  verifyAdminSessionToken,
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  completePasswordReset,
  parseCookies,
} from './adminSecurity.ts';

export const adminAuthRouter = Router();

/**
 * POST /api/admin/auth/login
 * Strict authentication requiring telecomqaswa@gmail.com and verified password
 */
adminAuthRouter.post('/login', async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  // 1. Check Rate Limiter
  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Account temporarily locked for ${rateLimit.remainingLockoutSeconds} seconds.`,
    });
  }

  const { email, password } = req.body || {};
  const cleanEmail = (email || '').trim().toLowerCase();

  // 2. Reject non-authorized emails immediately with 403 Forbidden
  if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    recordFailedLogin(ip);
    return res.status(403).json({
      success: false,
      error: 'Access denied. This email address is not authorized to access the QASWA TELECOM Admin Panel.',
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Please enter your administrator password.',
    });
  }

  // 3. Verify Password from Database
  try {
    const { hash, salt } = await getAdminCredentials();
    const isPasswordCorrect = verifyPassword(password, salt, hash);

    if (!isPasswordCorrect) {
      recordFailedLogin(ip);
      return res.status(401).json({
        success: false,
        error: 'Invalid password. Please verify your administrator credentials.',
      });
    }

    // 4. Successful Login
    recordSuccessfulLogin(ip);
    const token = await createAdminSessionToken();

    // Set secure cookie
    const isHttps = req.secure || req.get('x-forwarded-proto') === 'https';
    res.cookie('qaswa_admin_token', token, {
      httpOnly: false, // Accessible to front-end fetch client and server
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      email: AUTHORIZED_ADMIN_EMAIL,
      token,
      message: 'Authentication successful. Welcome to QASWA TELECOM Admin.',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal authentication error occurred. Please try again.',
    });
  }
});

/**
 * POST /api/admin/auth/forgot-password
 * Triggers 6-digit OTP only for telecomqaswa@gmail.com
 */
adminAuthRouter.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body || {};
  const result = requestPasswordResetOtp(email);

  if (!result.success) {
    // 403 if unauthorized email, 429 if cooldown
    const status = result.cooldownRemaining ? 429 : 403;
    return res.status(status).json({
      success: false,
      error: result.message,
      cooldownRemaining: result.cooldownRemaining,
    });
  }

  return res.json({
    success: true,
    message: result.message,
  });
});

/**
 * POST /api/admin/auth/verify-otp
 * Verifies OTP and returns single-use resetToken
 */
adminAuthRouter.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, otp } = req.body || {};
  const result = verifyPasswordResetOtp(email, otp);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.message,
    });
  }

  return res.json({
    success: true,
    message: result.message,
    resetToken: result.resetToken,
  });
});

/**
 * POST /api/admin/auth/reset-password
 * Completes password reset using single-use resetToken
 */
adminAuthRouter.post('/reset-password', async (req: Request, res: Response) => {
  const { email, resetToken, newPassword } = req.body || {};

  if (!newPassword) {
    return res.status(400).json({
      success: false,
      error: 'New password is required.',
    });
  }

  const result = await completePasswordReset(email, resetToken, newPassword);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.message,
    });
  }

  return res.json({
    success: true,
    message: result.message,
  });
});

/**
 * GET /api/admin/auth/session
 * Verifies active session token from header or cookie
 */
adminAuthRouter.get('/session', async (req: Request, res: Response) => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split('Bearer ')[1].trim();
  }

  if (!token) {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies['qaswa_admin_token'];
  }

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  const verification = await verifyAdminSessionToken(token);
  if (!verification.valid || !verification.email) {
    return res.status(401).json({
      authenticated: false,
      error: verification.error,
    });
  }

  return res.json({
    authenticated: true,
    email: verification.email,
  });
});

/**
 * POST /api/admin/auth/logout
 * Clears cookie and session
 */
adminAuthRouter.post('/logout', async (req: Request, res: Response) => {
  res.clearCookie('qaswa_admin_token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

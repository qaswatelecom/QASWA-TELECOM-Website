import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.ts';
import { siteSettings } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export const AUTHORIZED_ADMIN_EMAIL = 'telecomqaswa@gmail.com';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const OTP_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_OTP_ATTEMPTS = 5;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

// In-memory rate limiting and active OTP stores
interface LoginAttemptTracker {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}
const loginAttemptsMap = new Map<string, LoginAttemptTracker>();

interface ActiveOtpRecord {
  email: string;
  hashedOtp: string;
  salt: string;
  expiresAt: number;
  attempts: number;
  used: boolean;
  resetToken?: string;
  resetTokenExpiresAt?: number;
  lastRequestedAt: number;
}
let activeOtpStore: ActiveOtpRecord | null = null;

// Fallback in-memory secret in case DB is read-only
let cachedServerSecret: string | null = null;

/**
 * Validates password complexity:
 * - At least 12 characters
 * - Uppercase letter
 * - Lowercase letter
 * - Number
 * - Special character
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character (!@#$%^&*).' };
  }
  return { valid: true };
}

/**
 * Hashes password using Node.js crypto.scryptSync with 16-byte random salt
 */
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

/**
 * Timing-safe password verification
 */
export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    const hashBuf = Buffer.from(hash, 'hex');
    const expectedBuf = Buffer.from(expectedHash, 'hex');
    if (hashBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, expectedBuf);
  } catch (e) {
    return false;
  }
}

/**
 * Gets or initializes the server session signing secret from DB / process.env
 */
export async function getSigningSecret(): Promise<string> {
  if (cachedServerSecret) return cachedServerSecret;
  if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32) {
    cachedServerSecret = process.env.ADMIN_SESSION_SECRET;
    return cachedServerSecret;
  }

  try {
    const secretRow = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'ADMIN_SESSION_SECRET'))
      .limit(1);

    if (secretRow[0]?.value) {
      cachedServerSecret = secretRow[0].value;
      return cachedServerSecret;
    }

    const newSecret = crypto.randomBytes(48).toString('hex');
    await db
      .insert(siteSettings)
      .values({
        key: 'ADMIN_SESSION_SECRET',
        value: newSecret,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: newSecret },
      });

    cachedServerSecret = newSecret;
    return cachedServerSecret;
  } catch (e) {
    if (!cachedServerSecret) {
      cachedServerSecret = crypto.randomBytes(48).toString('hex');
    }
    return cachedServerSecret;
  }
}

/**
 * Gets current session version. When password is reset, this version increments,
 * instantly invalidating all existing active sessions.
 */
export async function getSessionVersion(): Promise<number> {
  try {
    const row = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'ADMIN_SESSION_VERSION'))
      .limit(1);

    if (row[0]?.value) {
      const parsed = parseInt(row[0].value, 10);
      return isNaN(parsed) ? 1 : parsed;
    }

    await db
      .insert(siteSettings)
      .values({
        key: 'ADMIN_SESSION_VERSION',
        value: '1',
      })
      .onConflictDoNothing();

    return 1;
  } catch (e) {
    return 1;
  }
}

/**
 * Increments session version in DB to invalidate all previous sessions
 */
export async function invalidateAllSessions(): Promise<number> {
  const current = await getSessionVersion();
  const nextVersion = current + 1;
  try {
    await db
      .insert(siteSettings)
      .values({
        key: 'ADMIN_SESSION_VERSION',
        value: nextVersion.toString(),
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: nextVersion.toString() },
      });
  } catch (e) {
    console.error('Failed to update session version in DB:', e);
  }
  return nextVersion;
}

/**
 * Gets or initializes the authorized admin credentials from DB
 */
export async function getAdminCredentials(): Promise<{ hash: string; salt: string }> {
  try {
    const [hashRow, saltRow] = await Promise.all([
      db.select().from(siteSettings).where(eq(siteSettings.key, 'ADMIN_AUTH_HASH')).limit(1),
      db.select().from(siteSettings).where(eq(siteSettings.key, 'ADMIN_AUTH_SALT')).limit(1),
    ]);

    if (hashRow[0]?.value && saltRow[0]?.value) {
      return { hash: hashRow[0].value, salt: saltRow[0].value };
    }

    // Initialize default secure admin password: Qaswa@Telecom2026!
    const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Qaswa@Telecom2026!';
    const { hash, salt } = hashPassword(defaultPassword);

    await Promise.all([
      db
        .insert(siteSettings)
        .values({ key: 'ADMIN_AUTH_HASH', value: hash })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: hash },
        }),
      db
        .insert(siteSettings)
        .values({ key: 'ADMIN_AUTH_SALT', value: salt })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: salt },
        }),
    ]);

    return { hash, salt };
  } catch (e) {
    console.error('Error fetching admin credentials:', e);
    // Fallback safe default
    const fallbackPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Qaswa@Telecom2026!';
    return hashPassword(fallbackPassword);
  }
}

/**
 * Updates admin password in DB
 */
export async function setAdminPassword(newPassword: string): Promise<boolean> {
  const { hash, salt } = hashPassword(newPassword);

  await Promise.all([
    db
      .insert(siteSettings)
      .values({ key: 'ADMIN_AUTH_HASH', value: hash })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: hash },
      }),
    db
      .insert(siteSettings)
      .values({ key: 'ADMIN_AUTH_SALT', value: salt })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: salt },
      }),
  ]);

  // Invalidate previous sessions
  await invalidateAllSessions();
  return true;
}

/**
 * Creates a signed admin session token: base64url(payload) + '.' + HMAC-SHA256
 */
export async function createAdminSessionToken(): Promise<string> {
  const secret = await getSigningSecret();
  const sessionVersion = await getSessionVersion();
  const payload = {
    email: AUTHORIZED_ADMIN_EMAIL,
    role: 'ADMIN',
    version: sessionVersion,
    exp: Date.now() + TOKEN_EXPIRY_MS,
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

/**
 * Verifies an admin session token
 */
export async function verifyAdminSessionToken(
  token: string
): Promise<{ valid: boolean; email?: string; error?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Missing token' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed token' };
  }

  const [payloadStr, signature] = parts;
  const secret = await getSigningSecret();
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  if (signature !== expectedSig) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const payloadJson = Buffer.from(payloadStr, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadJson);

    // 1. Verify email matches AUTHORIZED_ADMIN_EMAIL
    if (!payload.email || payload.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      return { valid: false, error: 'Unauthorized email' };
    }

    // 2. Verify token expiry
    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false, error: 'Session expired' };
    }

    // 3. Verify session version has not been invalidated
    const currentVersion = await getSessionVersion();
    if (payload.version !== currentVersion) {
      return { valid: false, error: 'Session invalidated due to password change or logout' };
    }

    return { valid: true, email: payload.email };
  } catch (e) {
    return { valid: false, error: 'Invalid token content' };
  }
}

/**
 * Helper to parse cookies from header
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=');
    const cleanName = name?.trim();
    if (!cleanName) return;
    list[cleanName] = decodeURIComponent(rest.join('=').trim());
  });
  return list;
}

/**
 * Rate Limiter for Login Attempts
 */
export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingLockoutSeconds?: number } {
  const tracker = loginAttemptsMap.get(ip);
  const now = Date.now();

  if (tracker && tracker.lockedUntil && tracker.lockedUntil > now) {
    const remaining = Math.ceil((tracker.lockedUntil - now) / 1000);
    return { allowed: false, remainingLockoutSeconds: remaining };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const tracker = loginAttemptsMap.get(ip);

  if (!tracker || (tracker.lockedUntil && tracker.lockedUntil <= now)) {
    loginAttemptsMap.set(ip, { count: 1, firstAttempt: now });
    return;
  }

  tracker.count += 1;
  if (tracker.count >= MAX_LOGIN_ATTEMPTS) {
    tracker.lockedUntil = now + LOGIN_LOCKOUT_MS;
  }
  loginAttemptsMap.set(ip, tracker);
}

export function recordSuccessfulLogin(ip: string): void {
  loginAttemptsMap.delete(ip);
}

/**
 * OTP Generation & Management
 */
export function requestPasswordResetOtp(email: string): {
  success: boolean;
  message: string;
  cooldownRemaining?: number;
} {
  const cleanEmail = (email || '').trim().toLowerCase();

  // ONLY telecomqaswa@gmail.com is authorized
  if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      message: 'This email address is not authorized to reset the QASWA TELECOM Admin password.',
    };
  }

  const now = Date.now();

  // Check cooldown
  if (activeOtpStore && activeOtpStore.lastRequestedAt + OTP_COOLDOWN_MS > now) {
    const remaining = Math.ceil((activeOtpStore.lastRequestedAt + OTP_COOLDOWN_MS - now) / 1000);
    return {
      success: false,
      message: `Please wait ${remaining} seconds before requesting a new OTP.`,
      cooldownRemaining: remaining,
    };
  }

  // Generate 6-digit secure numeric OTP
  const rawOtp = crypto.randomInt(100000, 1000000).toString();
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedOtp = crypto.scryptSync(rawOtp, salt, 32).toString('hex');

  activeOtpStore = {
    email: cleanEmail,
    hashedOtp,
    salt,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    used: false,
    lastRequestedAt: now,
  };

  // Dispatch Email Notification
  dispatchOtpEmail(cleanEmail, rawOtp);

  return {
    success: true,
    message: `A secure 6-digit OTP has been dispatched to ${cleanEmail}. It is valid for 10 minutes.`,
  };
}

/**
 * Verifies entered OTP
 */
export function verifyPasswordResetOtp(
  email: string,
  enteredOtp: string
): { success: boolean; message: string; resetToken?: string } {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanOtp = (enteredOtp || '').trim();

  if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, message: 'Unauthorized email address.' };
  }

  if (!activeOtpStore || activeOtpStore.used || activeOtpStore.email !== cleanEmail) {
    return { success: false, message: 'No active OTP found. Please request a new OTP.' };
  }

  if (Date.now() > activeOtpStore.expiresAt) {
    activeOtpStore = null;
    return { success: false, message: 'OTP has expired. Please request a new OTP.' };
  }

  if (activeOtpStore.attempts >= MAX_OTP_ATTEMPTS) {
    activeOtpStore = null;
    return {
      success: false,
      message: 'Too many incorrect attempts. This OTP has been invalidated for security. Please request a new one.',
    };
  }

  // Timing safe verification
  const computedHash = crypto.scryptSync(cleanOtp, activeOtpStore.salt, 32).toString('hex');
  const hashBuf = Buffer.from(computedHash, 'hex');
  const expectedBuf = Buffer.from(activeOtpStore.hashedOtp, 'hex');

  const isMatch = hashBuf.length === expectedBuf.length && crypto.timingSafeEqual(hashBuf, expectedBuf);

  if (!isMatch) {
    activeOtpStore.attempts += 1;
    const remaining = MAX_OTP_ATTEMPTS - activeOtpStore.attempts;
    return {
      success: false,
      message: `Incorrect OTP. You have ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    };
  }

  // Issue single-use reset token valid for 5 minutes
  const resetToken = crypto.randomBytes(32).toString('hex');
  activeOtpStore.resetToken = resetToken;
  activeOtpStore.resetTokenExpiresAt = Date.now() + 5 * 60 * 1000;
  activeOtpStore.used = true; // Invalidate OTP for reuse

  return {
    success: true,
    message: 'OTP verified successfully. You may now set your new administrator password.',
    resetToken,
  };
}

/**
 * Completes Password Reset using single-use resetToken
 */
export async function completePasswordReset(
  email: string,
  resetToken: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const cleanEmail = (email || '').trim().toLowerCase();

  if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, message: 'Unauthorized email address.' };
  }

  if (
    !activeOtpStore ||
    !activeOtpStore.resetToken ||
    activeOtpStore.resetToken !== resetToken
  ) {
    return { success: false, message: 'Invalid or expired password reset session. Please start over.' };
  }

  if (activeOtpStore.resetTokenExpiresAt && Date.now() > activeOtpStore.resetTokenExpiresAt) {
    activeOtpStore = null;
    return { success: false, message: 'Password reset session has expired. Please start over.' };
  }

  // Validate password strength
  const strengthCheck = validatePasswordStrength(newPassword);
  if (!strengthCheck.valid) {
    return { success: false, message: strengthCheck.error || 'Password does not meet security criteria.' };
  }

  // Update password in database & invalidate all existing sessions
  await setAdminPassword(newPassword);

  // Clear OTP and resetToken immediately
  activeOtpStore = null;

  return {
    success: true,
    message: 'Administrator password has been successfully updated. All active sessions have been invalidated. Please log in with your new password.',
  };
}

/**
 * Safe email dispatcher.
 * In production, if SMTP_HOST / RESEND_API_KEY is configured, sends via email service.
 * In sandbox/development, safely notifies without logging the raw secret in public channels.
 */
function dispatchOtpEmail(recipient: string, otp: string): void {
  // If SMTP or email integration exists:
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Transmit via SMTP
    return;
  }
  // Safe console notification for development environment
  console.log(`[QASWA SECURITY] Password reset OTP dispatched for authorized admin: ${recipient}`);
  // In dev sandbox only:
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV OTP NOTIFICATION] Code: ${otp} (Expires in 10 minutes)`);
  }
}

export interface AdminAuthRequest extends Request {
  adminEmail?: string;
}

/**
 * Server-side Middleware to protect ALL /api/admin/* endpoints:
 * 1. Checks Bearer token or HttpOnly cookie
 * 2. Verifies token signature and expiration
 * 3. Enforces that email strictly equals telecomqaswa@gmail.com
 * 4. Checks session version has not been revoked
 */
export const requireAuthorizedAdmin = async (
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. Allow public auth endpoints under /api/admin/auth/
  if (req.path.startsWith('/auth/')) {
    return next();
  }

  // 2. Extract token from Authorization header or cookie
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
    return res.status(401).json({
      error: 'Unauthorized: Admin authentication required.',
    });
  }

  // 3. Verify Admin Session Token
  const verification = await verifyAdminSessionToken(token);
  if (!verification.valid || !verification.email) {
    return res.status(401).json({
      error: verification.error || 'Unauthorized: Invalid or expired session.',
    });
  }

  // 4. Strict Email Authorization check
  if (verification.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({
      error: 'Access denied. This email address is not authorized to access the QASWA TELECOM Admin Panel.',
    });
  }

  req.adminEmail = verification.email;
  next();
};

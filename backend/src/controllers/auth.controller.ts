import { Request, Response } from 'express';
import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../config/mail';
import crypto from 'crypto';
import { z } from 'zod';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['USER', 'AGENT']).default('USER'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const setCookies = (res: Response, token: string, refreshToken: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const extractRequestMetadata = (req: Request) => {
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const geo = geoip.lookup(ipAddress) || { country: 'Unknown', city: 'Unknown', ll: [0, 0] };
  
  const userAgentString = req.headers['user-agent'] || '';
  const parser = new UAParser(userAgentString);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    ipAddress,
    country: geo.country,
    city: geo.city,
    latitude: geo.ll[0],
    longitude: geo.ll[1],
    userAgent: userAgentString,
    browser: browser.name || 'Unknown',
    browserVersion: browser.version || 'Unknown',
    os: os.name || 'Unknown',
    device: device.model || device.type || 'Desktop',
    platform: os.name || 'Unknown'
  };
};

const logLoginAttempt = async (
  userId: string, 
  req: Request, 
  status: 'SUCCESS' | 'FAILED' | 'LOCKED', 
  portalType: string,
  failureReason?: string
) => {
  const meta = extractRequestMetadata(req);
  await prisma.loginHistory.create({
    data: {
      userId,
      ipAddress: meta.ipAddress,
      country: meta.country,
      city: meta.city,
      device: meta.device,
      browser: meta.browser,
      os: meta.os,
      status,
      failureReason,
      portalType
    }
  });
};

const handleFailedAttempt = async (user: any, req: Request, portalType: string) => {
  const newFails = user.failedLoginAttempts + 1;
  let updateData: any = { failedLoginAttempts: newFails };
  
  if (newFails >= 5) {
    updateData.accountLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
    await logLoginAttempt(user.id, req, 'LOCKED', portalType, 'Exceeded 5 failed attempts');
  } else {
    await logLoginAttempt(user.id, req, 'FAILED', portalType, 'Invalid credentials');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: updateData
  });
};

// Core Login Logic Reused by all Portals
const coreLogin = async (req: Request, res: Response, requiredRole: string, portalType: string) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Check Lockout
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      await logLoginAttempt(user.id, req, 'LOCKED', portalType, 'Account is temporarily locked');
      return res.status(403).json({ status: 'error', message: 'Account locked due to too many failed attempts. Try again in 15 minutes.' });
    }

    // Role Enforcement
    if (user.role.name !== requiredRole) {
      await logLoginAttempt(user.id, req, 'FAILED', portalType, `Access denied for ${requiredRole} portal`);
      return res.status(403).json({ status: 'error', message: `You are not authorized to access this portal.` });
    }

    if (!user.password) {
      await handleFailedAttempt(user, req, portalType);
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      await handleFailedAttempt(user, req, portalType);
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    if (user.status !== 'ACTIVE') {
      await logLoginAttempt(user.id, req, 'FAILED', portalType, 'Account suspended');
      return res.status(403).json({ status: 'error', message: 'Account is suspended or banned' });
    }

    // Success! Reset failures
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        lastLogin: new Date(),
        lastLoginIP: extractRequestMetadata(req).ipAddress || '127.0.0.1',
        isOnline: true
      }
    });

    const token = generateToken({ userId: user.id, role: user.role.name });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role.name });

    const meta = extractRequestMetadata(req);
    await prisma.refreshToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        ...meta
      }
    });

    await logLoginAttempt(user.id, req, 'SUCCESS', portalType);

    setCookies(res, token, refreshToken);

    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.name,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// Isolated Portal Endpoints
export const loginCustomer = async (req: Request, res: Response) => coreLogin(req, res, 'USER', 'Customer');
export const loginAgent = async (req: Request, res: Response) => coreLogin(req, res, 'AGENT', 'Agent');
export const loginAdmin = async (req: Request, res: Response) => coreLogin(req, res, 'ADMIN', 'Admin');
export const loginSuperAdmin = async (req: Request, res: Response) => coreLogin(req, res, 'SUPER_ADMIN', 'SuperAdmin');


export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    }

    const { email, password, firstName, lastName, phone, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already in use' });
    }

    let roleRecord = await prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) {
      roleRecord = await prisma.role.create({ data: { name: role } });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        roleId: roleRecord.id,
      },
      include: { role: true },
    });

    const token = generateToken({ userId: user.id, role: user.role.name });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role.name });

    const meta = extractRequestMetadata(req);
    await prisma.refreshToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ...meta
      }
    });

    setCookies(res, token, refreshToken);

    res.status(201).json({
      status: 'success',
      data: { token, user: { id: user.id, email: user.email, role: user.role.name } },
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ status: 'error', message: 'No refresh token' });

    const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!dbToken || dbToken.isRevoked || dbToken.expiresAt < new Date()) {
      return res.status(401).json({ status: 'error', message: 'Invalid or revoked refresh token' });
    }

    const decoded = verifyRefreshToken(token);
    
    await prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { isRevoked: true, lastActive: new Date() }
    });

    const newToken = generateToken({ userId: decoded.userId, role: decoded.role });
    const newRefreshToken = generateRefreshToken({ userId: decoded.userId, role: decoded.role });

    const meta = extractRequestMetadata(req);
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ...meta
      }
    });

    setCookies(res, newToken, newRefreshToken);

    res.status(200).json({
      status: 'success',
      data: { token: newToken }
    });
  } catch (error: any) {
    res.status(401).json({ status: 'error', message: 'Invalid refresh token' });
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { isRevoked: true }
      });
    }
  } catch(e) {}
  
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.status(200).json({ status: 'success', message: 'Logged out' });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role.name,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});

const updateProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
});

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    if (!user) {
      return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }

    const roleName = user.role?.name || 'USER';
    const token = generateToken({ userId: user.id, role: roleName });
    const refreshToken = generateRefreshToken({ userId: user.id, role: roleName });

    const meta = extractRequestMetadata(req);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ...meta
      }
    });
    setCookies(res, token, refreshToken);
    
    res.redirect(`${FRONTEND_URL}/dashboard#token=${token}`);
  } catch (error: any) {
    res.redirect(`${FRONTEND_URL}/login?error=server_error`);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) {
      return res.status(200).json({ status: 'success', message: 'If email exists, reset link sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      }
    });

    await sendPasswordResetEmail(user.email, resetToken);
    res.status(200).json({ status: 'success', message: 'If email exists, reset link sent' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    }

    const { token, newPassword } = parsed.data;

    const resetRecord = await prisma.passwordReset.findFirst({
      where: { token, isUsed: false, expiresAt: { gt: new Date() } }
    });

    if (!resetRecord) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({ where: { email: resetRecord.email } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { isUsed: true },
    });

    res.status(200).json({ status: 'success', message: 'Password reset successful' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) return res.status(400).json({ status: 'error', message: 'Token required' });

    const verificationRecord = await prisma.emailVerification.findFirst({
      where: { token, isUsed: false, expiresAt: { gt: new Date() } }
    });

    if (!verificationRecord) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({ where: { email: verificationRecord.email } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await prisma.emailVerification.update({
      where: { id: verificationRecord.id },
      data: { isUsed: true },
    });

    res.status(200).json({ status: 'success', message: 'Email verified successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(200).json({ status: 'success', message: 'If email exists, verification sent' });
    }

    if (user.isVerified) {
      return res.status(400).json({ status: 'error', message: 'Already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.emailVerification.create({
      data: {
        email: user.email,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }
    });

    await sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({ status: 'success', message: 'Verification email sent' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    }

    const userId = (req as any).user.id;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
      include: { role: true }
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role.name,
          profileImage: updatedUser.profileImage,
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    }

    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      return res.status(400).json({ status: 'error', message: 'Cannot change password' });
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Incorrect current password' });
    }

    const hashedPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

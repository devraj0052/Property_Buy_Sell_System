import { Router } from 'express';
import passport from 'passport';
import { 
  register, 
  loginCustomer, 
  loginAgent,
  loginAdmin,
  loginSuperAdmin,
  forgotPassword, 
  resetPassword, 
  verifyEmail, 
  resendVerification, 
  updateProfile, 
  changePassword,
  refreshTokenHandler,
  logoutHandler,
  getMe,
  googleCallback
} from '../controllers/auth.controller';
import { getSessions, revokeSession, revokeAllOtherSessions, getLoginHistory } from '../controllers/session.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Standard Auth
router.post('/register', register);
router.post('/login', loginCustomer); // Legacy fallback, or specific customer
router.post('/customer/login', loginCustomer);
router.post('/agent/login', loginAgent);
router.post('/admin/login', loginAdmin);
router.post('/super-admin/login', loginSuperAdmin);
router.post('/logout', logoutHandler);
router.post('/refresh-token', refreshTokenHandler);
router.get('/me', authenticate, getMe);

// Sessions & Security
router.get('/sessions', authenticate, getSessions);
router.delete('/sessions/all', authenticate, revokeAllOtherSessions);
router.delete('/sessions/:id', authenticate, revokeSession);
router.get('/login-history', authenticate, getLoginHistory);

// Password & Email Verification
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Profile Management
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), googleCallback);

export default router;

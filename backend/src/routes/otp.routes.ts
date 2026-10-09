import { Router } from 'express';
import { requestOtp, verifyOtp } from '../controllers/otp.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Used for both email and phone verification
router.post('/send', requestOtp);
router.post('/verify', verifyOtp);

export default router;

import { Request, Response } from 'express';
import prisma from '../config/db';

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { phone, email } = req.body;
    if (!phone && !email) {
      return res.status(400).json({ status: 'error', message: 'Phone or email is required' });
    }

    const identifier = phone || email;
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // In a real app, actually SEND the OTP here via SMS/Email

    await prisma.otpVerification.create({
      data: {
        identifier,
        otp,
        expiresAt,
      }
    });

    res.status(200).json({ status: 'success', message: 'OTP sent successfully (mocked)' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, email, otp } = req.body;
    const identifier = phone || email;

    if (!identifier || !otp) return res.status(400).json({ status: 'error', message: 'Identifier and OTP required' });

    const record = await prisma.otpVerification.findFirst({
      where: { identifier, otp, isUsed: false, expiresAt: { gt: new Date() } }
    });

    if (!record) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired OTP' });
    }

    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { isUsed: true }
    });

    res.status(200).json({ status: 'success', message: 'OTP verified successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

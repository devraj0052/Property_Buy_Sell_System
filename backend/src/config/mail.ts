import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'PropEx <noreply@propex.com>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn(`[Mail] Not sent. SMTP credentials missing. To: ${to}, Subject: ${subject}`);
    return;
  }
  return transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `${FRONTEND_URL}/verify-email?token=${token}`;
  const html = `
    <h2>Verify your email address</h2>
    <p>Please click the link below to verify your email address:</p>
    <a href="${url}">${url}</a>
  `;
  return sendMail(email, 'Verify your PropEx account', html);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const url = `${FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <h2>Reset your password</h2>
    <p>Please click the link below to reset your password:</p>
    <a href="${url}">${url}</a>
    <p>If you did not request this, please ignore this email.</p>
  `;
  return sendMail(email, 'Reset your PropEx password', html);
};

export const sendOtpEmail = async (email: string, otp: string) => {
  const html = `
    <h2>Your OTP Code</h2>
    <p>Your one-time password is: <strong>${otp}</strong></p>
    <p>This code is valid for 10 minutes.</p>
  `;
  return sendMail(email, 'PropEx - Your OTP Code', html);
};

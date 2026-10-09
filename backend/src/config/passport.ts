import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './db';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dev_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dev_google_client_secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        // Find user by Google ID or Email
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { googleId: profile.id },
              { email: email },
            ],
          },
        });

        if (user) {
          // Update googleId if missing
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: profile.id, isVerified: true },
            });
          }
          return done(null, user);
        }

        // Create new user if not found
        // First find the 'USER' role
        let userRole = await prisma.role.findUnique({
          where: { name: 'USER' },
        });

        if (!userRole) {
          userRole = await prisma.role.create({
            data: { name: 'USER' },
          });
        }

        const newUser = await prisma.user.create({
          data: {
            email,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            googleId: profile.id,
            isVerified: true, // Google emails are already verified
            roleId: userRole.id,
            profileImage: profile.photos?.[0].value,
            // Create default empty password since they login via google
            password: '', 
          },
        });

        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;

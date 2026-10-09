import { Request, Response } from 'express';
import prisma from '../config/db';

export const getSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const currentToken = req.cookies.refreshToken;

    const sessions = await prisma.refreshToken.findMany({
      where: { 
        userId, 
        isRevoked: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { lastActive: 'desc' },
      select: {
        id: true,
        sessionId: true,
        token: true,
        ipAddress: true,
        country: true,
        city: true,
        browser: true,
        browserVersion: true,
        os: true,
        device: true,
        platform: true,
        lastActive: true,
        createdAt: true
      }
    });

    const formattedSessions = sessions.map(session => ({
      ...session,
      isCurrentSession: session.token === currentToken,
      token: undefined // Do not leak the actual refresh token payload
    }));

    res.status(200).json({
      status: 'success',
      data: { sessions: formattedSessions }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const revokeSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const session = await prisma.refreshToken.findFirst({
      where: { id: parseInt(id as string), userId }
    });

    if (!session) {
      return res.status(404).json({ status: 'error', message: 'Session not found' });
    }

    await prisma.refreshToken.update({
      where: { id: session.id },
      data: { isRevoked: true }
    });

    res.status(200).json({ status: 'success', message: 'Session revoked successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const revokeAllOtherSessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const currentToken = req.cookies.refreshToken;

    await prisma.refreshToken.updateMany({
      where: { 
        userId,
        token: { not: currentToken }
      },
      data: { isRevoked: true }
    });

    res.status(200).json({ status: 'success', message: 'All other sessions revoked successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getLoginHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as any) || 1;
    const limit = parseInt(req.query.limit as any) || 10;
    const skip = (page - 1) * limit;

    const history = await prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { loginTime: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.loginHistory.count({ where: { userId } });

    res.status(200).json({
      status: 'success',
      data: {
        history,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import prisma from '../config/db';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { 
        role: {
          include: { permissions: true }
        }
      },
    });

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized - User not found' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ status: 'error', message: 'Account is suspended or banned' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    
    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({ status: 'error', message: 'Forbidden - Insufficient roles' });
    }
    
    next();
  };
};

export const requirePermission = (permissionName: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role || !req.user.role.permissions) {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    
    // Check if user has the specific permission OR if they are a SUPER_ADMIN
    const hasPermission = req.user.role.permissions.some((p: any) => p.name === permissionName) || req.user.role.name === 'SUPER_ADMIN';
    
    if (!hasPermission) {
      return res.status(403).json({ status: 'error', message: `Forbidden - Missing permission: ${permissionName}` });
    }
    
    next();
  };
};

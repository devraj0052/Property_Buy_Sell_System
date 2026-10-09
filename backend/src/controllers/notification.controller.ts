import { Request, Response } from 'express';
import prisma from '../config/db';

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: notifications });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    
    await prisma.notification.updateMany({
      where: { 
        id: Number(id),
        userId 
      },
      data: { isRead: true }
    });
    
    res.status(200).json({ status: 'success', message: 'Marked as read' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    
    res.status(200).json({ status: 'success', message: 'All marked as read' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

import { Request, Response } from 'express';
import prisma from '../config/db';

// Manage Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: users });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    
    const user = await prisma.user.update({
      where: { id },
      data: { status }
    });
    
    // Log Activity
    await prisma.activityLog.create({
      data: { action: 'UPDATE_USER_STATUS', details: `Status changed to ${status} for user ${id}`, userId: (req as any).user.id }
    });

    res.status(200).json({ status: 'success', data: user });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Manage Properties (Approval Workflow)
export const getPendingProperties = async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'PENDING' },
      include: { user: true, location: true, category: true, images: true }
    });
    res.status(200).json({ status: 'success', data: properties });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const approveProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const property = await prisma.property.update({
      where: { id: Number(id) },
      data: { status: 'ACTIVE' }
    });

    // Send Notification to User
    await prisma.notification.create({
      data: {
        userId: property.userId,
        title: 'Property Approved',
        message: `Your property listing "${property.title}" has been approved and is now live.`,
        type: 'PROPERTY'
      }
    });

    res.status(200).json({ status: 'success', message: 'Property approved successfully', data: property });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const rejectProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const property = await prisma.property.update({
      where: { id: Number(id) },
      data: { status: 'REJECTED' }
    });

    // Send Notification to User
    await prisma.notification.create({
      data: {
        userId: property.userId,
        title: 'Property Rejected',
        message: `Your property listing "${property.title}" was rejected. Reason: ${reason || 'Does not meet guidelines.'}`,
        type: 'PROPERTY'
      }
    });

    res.status(200).json({ status: 'success', message: 'Property rejected successfully', data: property });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Manage Analytics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProperties = await prisma.property.count();
    const activeProperties = await prisma.property.count({ where: { status: 'ACTIVE' } });
    const pendingProperties = await prisma.property.count({ where: { status: 'PENDING' } });
    
    const transactions = await prisma.transaction.findMany({ where: { status: 'SUCCESS' } });
    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

    res.status(200).json({ 
      status: 'success', 
      data: { totalUsers, totalProperties, activeProperties, pendingProperties, totalRevenue } 
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

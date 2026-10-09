import { Request, Response } from 'express';
import prisma from '../config/db';

export const addReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { propertyId, content, rating } = req.body;

    const property = await prisma.property.findUnique({ where: { id: Number(propertyId) } });
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        propertyId: Number(propertyId),
        content,
        rating: Number(rating),
        isApproved: false // Requires admin approval in a real app, but we can set to true if preferred
      }
    });

    // Create a rating entry to calculate average later
    await prisma.rating.upsert({
      where: {
        userId_propertyId: { userId, propertyId: Number(propertyId) }
      },
      update: { score: Number(rating) },
      create: { userId, propertyId: Number(propertyId), score: Number(rating) }
    });

    // Notify the property owner
    await prisma.notification.create({
      data: {
        userId: property.userId,
        title: 'New Review Received',
        message: `Your property ${property.title} received a new ${rating}-star review.`,
        type: 'PROPERTY'
      }
    });

    res.status(201).json({ status: 'success', data: review });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getPropertyReviews = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { propertyId: Number(propertyId), isApproved: true },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, profileImage: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: reviews });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

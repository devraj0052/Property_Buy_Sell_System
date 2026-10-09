import { Request, Response } from 'express';
import prisma from '../config/db';

export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ status: 'error', message: 'propertyId is required' });
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId: Number(propertyId),
        }
      }
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.status(200).json({ status: 'success', message: 'Removed from favorites' });
    } else {
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          propertyId: Number(propertyId),
        }
      });
      return res.status(201).json({ status: 'success', message: 'Added to favorites', data: favorite });
    }
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: { images: true, location: true }
        }
      }
    });
    res.status(200).json({ status: 'success', data: favorites });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

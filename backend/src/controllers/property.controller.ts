import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const createPropertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  price: z.number().positive(),
  purpose: z.enum(['BUY', 'RENT']),
  categoryId: z.number(),
  typeId: z.number(),
  locationId: z.number(),
  address: z.string(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  areaSize: z.number().positive(),
});

export const createProperty = async (req: Request, res: Response) => {
  try {
    const parsed = createPropertySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    }

    const userId = (req as any).user.id;
    const { title, description, price, purpose, categoryId, typeId, locationId, address, bedrooms, bathrooms, areaSize } = parsed.data;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const property = await prisma.property.create({
      data: {
        title,
        slug,
        description,
        price,
        purpose,
        categoryId,
        typeId,
        locationId,
        address,
        bedrooms,
        bathrooms,
        areaSize,
        userId,
      },
    });

    res.status(201).json({ status: 'success', data: property });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const { purpose, minPrice, maxPrice, categoryId, typeId, locationId } = req.query;

    const filters: any = {};
    if (purpose) filters.purpose = purpose;
    if (categoryId) filters.categoryId = Number(categoryId);
    if (typeId) filters.typeId = Number(typeId);
    if (locationId) filters.locationId = Number(locationId);
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = Number(minPrice);
      if (maxPrice) filters.price.lte = Number(maxPrice);
    }

    const properties = await prisma.property.findMany({
      where: filters,
      include: {
        category: true,
        type: true,
        location: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ status: 'success', data: properties });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getPropertyBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        category: true,
        type: true,
        location: true,
        images: true,
        amenities: { include: { amenity: true } },
        user: {
          select: { id: true, firstName: true, lastName: true, profileImage: true, email: true, phone: true }
        }
      },
    });

    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    // Increment views
    await prisma.property.update({
      where: { id: property.id },
      data: { viewsCount: { increment: 1 } },
    });

    res.status(200).json({ status: 'success', data: property });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

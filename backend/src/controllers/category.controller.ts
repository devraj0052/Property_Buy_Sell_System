import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2),
  icon: z.string().optional(),
});

const typeSchema = z.object({
  name: z.string().min(2),
  categoryId: z.number().int(),
});

const amenitySchema = z.object({
  name: z.string().min(2),
  icon: z.string().optional(),
});

const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// --- Property Category ---
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.propertyCategory.findMany();
    res.status(200).json({ status: 'success', data: categories });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    
    const slug = generateSlug(parsed.data.name);
    const category = await prisma.propertyCategory.create({
      data: { ...parsed.data, slug }
    });
    res.status(201).json({ status: 'success', data: category });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });

    const slug = generateSlug(parsed.data.name);
    const category = await prisma.propertyCategory.update({
      where: { id: Number(req.params.id) },
      data: { ...parsed.data, slug }
    });
    res.status(200).json({ status: 'success', data: category });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await prisma.propertyCategory.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// --- Property Type ---
export const getTypes = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const where = categoryId ? { categoryId: Number(categoryId) } : {};
    const types = await prisma.propertyType.findMany({ where, include: { category: true } });
    res.status(200).json({ status: 'success', data: types });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createType = async (req: Request, res: Response) => {
  try {
    const parsed = typeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    
    const slug = generateSlug(parsed.data.name);
    const type = await prisma.propertyType.create({
      data: { ...parsed.data, slug }
    });
    res.status(201).json({ status: 'success', data: type });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateType = async (req: Request, res: Response) => {
  try {
    const parsed = typeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });

    const slug = generateSlug(parsed.data.name);
    const type = await prisma.propertyType.update({
      where: { id: Number(req.params.id) },
      data: { ...parsed.data, slug }
    });
    res.status(200).json({ status: 'success', data: type });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteType = async (req: Request, res: Response) => {
  try {
    await prisma.propertyType.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// --- Amenity ---
export const getAmenities = async (req: Request, res: Response) => {
  try {
    const amenities = await prisma.amenity.findMany();
    res.status(200).json({ status: 'success', data: amenities });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createAmenity = async (req: Request, res: Response) => {
  try {
    const parsed = amenitySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    
    const amenity = await prisma.amenity.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: amenity });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateAmenity = async (req: Request, res: Response) => {
  try {
    const parsed = amenitySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });

    const amenity = await prisma.amenity.update({
      where: { id: Number(req.params.id) },
      data: parsed.data
    });
    res.status(200).json({ status: 'success', data: amenity });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteAmenity = async (req: Request, res: Response) => {
  try {
    await prisma.amenity.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

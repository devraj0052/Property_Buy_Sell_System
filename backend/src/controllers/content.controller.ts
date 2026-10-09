import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string(),
  linkUrl: z.string().optional(),
  position: z.string(),
  isActive: z.boolean().default(true),
});

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
  isActive: z.boolean().default(true),
});

const testimonialSchema = z.object({
  name: z.string(),
  designation: z.string().optional(),
  content: z.string(),
  image: z.string().optional(),
  rating: z.number().int().default(5),
  isActive: z.boolean().default(true),
});

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({ where: { isActive: true } });
    res.status(200).json({ status: 'success', data: banners });
  } catch (error: any) { res.status(500).json({ status: 'error', message: error.message }); }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const parsed = bannerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const banner = await prisma.banner.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: banner });
  } catch (error: any) { res.status(500).json({ status: 'error', message: error.message }); }
};

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.faq.findMany({ where: { isActive: true } });
    res.status(200).json({ status: 'success', data: faqs });
  } catch (error: any) { res.status(500).json({ status: 'error', message: error.message }); }
};

export const createFaq = async (req: Request, res: Response) => {
  try {
    const parsed = faqSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const faq = await prisma.faq.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: faq });
  } catch (error: any) { res.status(500).json({ status: 'error', message: error.message }); }
};

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ where: { isActive: true } });
    res.status(200).json({ status: 'success', data: testimonials });
  } catch (error: any) { res.status(500).json({ status: 'error', message: error.message }); }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const parsed = testimonialSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    const testimonial = await prisma.testimonial.create({ data: parsed.data });
    res.status(201).json({ status: 'success', data: testimonial });
  } catch (error: any) { res.status(500).json({ status: 'error', message: error.message }); }
};

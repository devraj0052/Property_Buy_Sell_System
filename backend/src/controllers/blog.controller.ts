import { Request, Response } from 'express';
import prisma from '../config/db';
import { z } from 'zod';

const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const blogCategorySchema = z.object({
  name: z.string().min(2),
});

const blogSchema = z.object({
  categoryId: z.number().int(),
  title: z.string().min(5),
  content: z.string().min(10),
  image: z.string().optional(),
  isPublished: z.boolean().default(true),
});

// --- Blog Category ---
export const getBlogCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.blogCategory.findMany();
    res.status(200).json({ status: 'success', data: categories });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createBlogCategory = async (req: Request, res: Response) => {
  try {
    const parsed = blogCategorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    
    const slug = generateSlug(parsed.data.name);
    const category = await prisma.blogCategory.create({
      data: { ...parsed.data, slug }
    });
    res.status(201).json({ status: 'success', data: category });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateBlogCategory = async (req: Request, res: Response) => {
  try {
    const parsed = blogCategorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });

    const slug = generateSlug(parsed.data.name);
    const category = await prisma.blogCategory.update({
      where: { id: Number(req.params.id) },
      data: { ...parsed.data, slug }
    });
    res.status(200).json({ status: 'success', data: category });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteBlogCategory = async (req: Request, res: Response) => {
  try {
    await prisma.blogCategory.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// --- Blog ---
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.blog.count()
    ]);

    res.status(200).json({
      status: 'success',
      data: blogs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: req.params.slug as string },
      include: { category: true }
    });
    
    if (!blog) return res.status(404).json({ status: 'error', message: 'Blog not found' });

    // Increment views
    await prisma.blog.update({
      where: { id: blog.id },
      data: { viewsCount: { increment: 1 } }
    });

    res.status(200).json({ status: 'success', data: blog });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const parsed = blogSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });
    
    const slug = generateSlug(parsed.data.title);
    const author = (req as any).user.firstName + ' ' + (req as any).user.lastName;
    
    const blog = await prisma.blog.create({
      data: { ...parsed.data, slug, author }
    });
    res.status(201).json({ status: 'success', data: blog });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const parsed = blogSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ status: 'error', errors: parsed.error.format() });

    const slug = generateSlug(parsed.data.title);
    const blog = await prisma.blog.update({
      where: { id: Number(req.params.id) },
      data: { ...parsed.data, slug }
    });
    res.status(200).json({ status: 'success', data: blog });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    await prisma.blog.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ status: 'success', message: 'Deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

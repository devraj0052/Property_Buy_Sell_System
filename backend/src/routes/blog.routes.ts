import { Router } from 'express';
import {
  getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory,
  getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog
} from '../controllers/blog.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Blog Category Routes
router.get('/categories', getBlogCategories);
router.post('/categories', authenticate, authorize(['ADMIN']), createBlogCategory);
router.put('/categories/:id', authenticate, authorize(['ADMIN']), updateBlogCategory);
router.delete('/categories/:id', authenticate, authorize(['ADMIN']), deleteBlogCategory);

// Blog Routes
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', authenticate, authorize(['ADMIN']), createBlog);
router.put('/:id', authenticate, authorize(['ADMIN']), updateBlog);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteBlog);

export default router;

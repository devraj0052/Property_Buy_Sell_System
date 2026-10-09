import { Router } from 'express';
import {
  getBanners, createBanner,
  getFaqs, createFaq,
  getTestimonials, createTestimonial
} from '../controllers/content.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public read routes
router.get('/banners', getBanners);
router.get('/faqs', getFaqs);
router.get('/testimonials', getTestimonials);

// Admin routes
router.use(authenticate, authorize(['ADMIN']));
router.post('/banners', createBanner);
router.post('/faqs', createFaq);
router.post('/testimonials', createTestimonial);

export default router;

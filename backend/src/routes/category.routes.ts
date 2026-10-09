import { Router } from 'express';
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  getTypes, createType, updateType, deleteType,
  getAmenities, createAmenity, updateAmenity, deleteAmenity
} from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Category Routes
router.get('/categories', getCategories);
router.post('/categories', authenticate, authorize(['ADMIN']), createCategory);
router.put('/categories/:id', authenticate, authorize(['ADMIN']), updateCategory);
router.delete('/categories/:id', authenticate, authorize(['ADMIN']), deleteCategory);

// Type Routes
router.get('/types', getTypes);
router.post('/types', authenticate, authorize(['ADMIN']), createType);
router.put('/types/:id', authenticate, authorize(['ADMIN']), updateType);
router.delete('/types/:id', authenticate, authorize(['ADMIN']), deleteType);

// Amenity Routes
router.get('/amenities', getAmenities);
router.post('/amenities', authenticate, authorize(['ADMIN']), createAmenity);
router.put('/amenities/:id', authenticate, authorize(['ADMIN']), updateAmenity);
router.delete('/amenities/:id', authenticate, authorize(['ADMIN']), deleteAmenity);

export default router;

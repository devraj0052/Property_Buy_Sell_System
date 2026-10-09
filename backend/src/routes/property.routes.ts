import { Router } from 'express';
import { createProperty, getAllProperties, getPropertyBySlug } from '../controllers/property.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createProperty);
router.get('/', getAllProperties);
router.get('/:slug', getPropertyBySlug);

export default router;

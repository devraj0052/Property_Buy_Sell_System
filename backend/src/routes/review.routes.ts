import { Router } from 'express';
import { addReview, getPropertyReviews } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, addReview);
router.get('/:propertyId', getPropertyReviews);

export default router;

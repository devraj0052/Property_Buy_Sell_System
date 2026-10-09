import { Router } from 'express';
import { toggleFavorite, getUserFavorites } from '../controllers/favorite.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/toggle', authenticate, toggleFavorite);
router.get('/', authenticate, getUserFavorites);

export default router;

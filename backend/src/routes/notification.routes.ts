import { Router } from 'express';
import { getUserNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getUserNotifications);
router.patch('/mark-all-read', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;

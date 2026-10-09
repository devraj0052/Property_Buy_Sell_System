import { Router } from 'express';
import { 
  getAllUsers, 
  updateUserStatus, 
  getPendingProperties, 
  approveProperty, 
  rejectProperty, 
  getDashboardStats 
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Only ADMIN can access these routes
router.use(authenticate, authorize(['ADMIN']));

// User Management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);

// Property Approvals
router.get('/properties/pending', getPendingProperties);
router.patch('/properties/:id/approve', approveProperty);
router.patch('/properties/:id/reject', rejectProperty);

// Dashboard
router.get('/stats', getDashboardStats);

export default router;

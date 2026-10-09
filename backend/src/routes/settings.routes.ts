import { Router } from 'express';
import {
  getAllSettings, getSettingsByGroup, updateSettings
} from '../controllers/settings.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public setting access for frontend config
router.get('/', getAllSettings);
router.get('/:group', getSettingsByGroup);

// Admin only setting updates
router.put('/', authenticate, authorize(['ADMIN']), updateSettings);

export default router;

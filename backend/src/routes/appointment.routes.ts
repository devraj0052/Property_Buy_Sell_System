import { Router } from 'express';
import {
  createAppointment, getMyAppointments, getAllAppointments, updateAppointmentStatus, cancelAppointment
} from '../controllers/appointment.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// User Routes
router.post('/', createAppointment);
router.get('/me', getMyAppointments);
router.put('/:id/cancel', cancelAppointment);

// Admin / Agent Routes
router.get('/', authorize(['ADMIN', 'AGENT']), getAllAppointments);
router.put('/:id/status', authorize(['ADMIN', 'AGENT']), updateAppointmentStatus);

export default router;

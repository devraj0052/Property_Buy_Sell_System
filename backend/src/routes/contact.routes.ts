import { Router } from 'express';
import {
  createContactMessage, getContactMessages, updateContactMessageStatus, deleteContactMessage,
  createInquiry, getInquiries, updateInquiryStatus, deleteInquiry
} from '../controllers/contact.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Contact Message Routes
router.post('/messages', createContactMessage); // Public
router.get('/messages', authenticate, authorize(['ADMIN']), getContactMessages);
router.put('/messages/:id/status', authenticate, authorize(['ADMIN']), updateContactMessageStatus);
router.delete('/messages/:id', authenticate, authorize(['ADMIN']), deleteContactMessage);

// Inquiry Routes
router.post('/inquiries', createInquiry); // Public
router.get('/inquiries', authenticate, authorize(['ADMIN', 'AGENT']), getInquiries); // Assuming Agents can see inquiries for their properties in a more complex setup, but ADMIN can see all.
router.put('/inquiries/:id/status', authenticate, authorize(['ADMIN', 'AGENT']), updateInquiryStatus);
router.delete('/inquiries/:id', authenticate, authorize(['ADMIN']), deleteInquiry);

export default router;

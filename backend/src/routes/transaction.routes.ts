import { Router } from 'express';
import {
  createTransaction, getMyTransactions, getAllTransactions, updateTransactionStatus
} from '../controllers/transaction.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createTransaction);
router.get('/me', getMyTransactions);

router.get('/', authorize(['ADMIN']), getAllTransactions);
router.put('/:id/status', authorize(['ADMIN']), updateTransactionStatus);

export default router;

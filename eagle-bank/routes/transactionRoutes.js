import { Router } from 'express';
import {createTransaction, getTransaction, getTransactions} from '../controllers/transactionController.js';

import requireAuth from '../middleware/userAuth.js';
const router = Router();

router.post('/', requireAuth, createTransaction);
router.get('/', requireAuth, getTransactions);
router.get('/:transactionId', requireAuth, getTransaction);

export default router;